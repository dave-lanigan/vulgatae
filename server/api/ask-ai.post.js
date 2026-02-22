import db from './dbClient.js'

const ASK_AI_CACHE_TTL_MS = 15 * 60 * 1000

if (!globalThis.__askAiCache) {
  globalThis.__askAiCache = new Map()
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getStatusCode(error) {
  return error?.response?.status || error?.statusCode || error?.status || 500
}

function getErrorMessage(error) {
  return (
    error?.data?.error?.message ||
    error?.data?.statusMessage ||
    error?.statusMessage ||
    error?.message ||
    'Unknown AI error.'
  )
}

function getCachedAnswer(cacheKey) {
  const entry = globalThis.__askAiCache.get(cacheKey)
  if (!entry) return null
  if (Date.now() - entry.ts > ASK_AI_CACHE_TTL_MS) {
    globalThis.__askAiCache.delete(cacheKey)
    return null
  }
  return entry.answer
}

function setCachedAnswer(cacheKey, answer) {
  globalThis.__askAiCache.set(cacheKey, {
    answer,
    ts: Date.now(),
  })
}

function parseBibleReference(input) {
  const trimmed = input.trim()
  const chapterVerse = /^(\d+):(\d+)(?:\s*[-–]\s*\d+)?$/
  const bookChapterVerse = /^(.+?)\s+(\d+)(?::(\d+))?(?:\s*[-–]\s*\d+)?$/

  let match = trimmed.match(chapterVerse)
  if (match) {
    return {
      chapter: Number(match[1]),
      verse: Number(match[2]),
      bookName: null,
    }
  }

  match = trimmed.match(bookChapterVerse)
  if (match) {
    return {
      bookName: match[1].trim().toLowerCase(),
      chapter: Number(match[2]),
      verse: match[3] ? Number(match[3]) : null,
    }
  }

  return null
}

function loadBibleContext(query) {
  const parsed = parseBibleReference(query)

  const baseSelect = `
    SELECT
      b.title AS title,
      b.title_latin AS titleLatin,
      v.chapter,
      v.verse,
      v.latin,
      v.english
    FROM verses v
    JOIN books b ON v.book = b.number
  `

  if (parsed?.bookName && parsed.chapter) {
    const params = [
      parsed.bookName,
      parsed.bookName,
      parsed.bookName,
      parsed.bookName,
      parsed.chapter,
    ]

    let sql = `${baseSelect}
      WHERE (
        lower(b.title) = ? OR
        lower(b.title_latin) = ? OR
        lower(COALESCE(b.alt_title, '')) = ? OR
        lower(COALESCE(b.book, '')) = ?
      )
      AND v.chapter = ?
    `

    if (parsed.verse) {
      sql += ' AND v.verse = ?'
      params.push(parsed.verse)
    }

    sql += ' ORDER BY v.verse ASC LIMIT 8'
    return db.prepare(sql).all(...params)
  }

  if (parsed?.chapter && parsed.verse) {
    return db
      .prepare(`${baseSelect}
        WHERE v.chapter = ? AND v.verse = ?
        ORDER BY v.book ASC
        LIMIT 8
      `)
      .all(parsed.chapter, parsed.verse)
  }

  const like = `%${query.toLowerCase()}%`
  return db
    .prepare(`${baseSelect}
      WHERE (
        lower(v.english) LIKE ? OR
        lower(v.latin) LIKE ? OR
        lower(b.title) LIKE ? OR
        lower(b.title_latin) LIKE ? OR
        lower(COALESCE(b.alt_title, '')) LIKE ?
      )
      ORDER BY v.book ASC, v.chapter ASC, v.verse ASC
      LIMIT 8
    `)
    .all(like, like, like, like, like)
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const geminiApiKey = config.geminiApiKey

  if (!geminiApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Gemini API key is not configured on the server.',
    })
  }

  const body = await readBody(event)
  const query = body?.query?.trim()

  const contextHits = loadBibleContext(query || '')
  const cacheKey = JSON.stringify({
    query: query?.toLowerCase(),
    context: contextHits.map((hit) => ({
      title: hit?.title,
      chapter: hit?.chapter,
      verse: hit?.verse,
    })),
  })

  if (!query) {
    throw createError({ statusCode: 400, statusMessage: 'Query is required.' })
  }

  const contextText = contextHits
    .map((hit, index) => {
      const title = hit?.title || 'Unknown'
      const chapter = hit?.chapter ?? '?'
      const verse = hit?.verse ?? '?'
      const latin = hit?.latin || ''
      const english = hit?.english || ''
      return `${index + 1}. ${title} ${chapter}:${verse}\nLatin: ${latin}\nEnglish: ${english}`
    })
    .join('\n\n')

  const prompt = [
    'You are a concise Catholic Bible study assistant focused on the Vulgate and Douay-Rheims context.',
    'Answer the user query in 3-5 short sentences.',
    'Use the provided verse context when relevant. If context is insufficient, say so briefly.',
    '',
    `User query: ${query}`,
    '',
    contextText ? `Search context:\n${contextText}` : 'Search context: none',
  ].join('\n')

  const cached = getCachedAnswer(cacheKey)
  if (cached) {
    return { answer: cached }
  }

  const models = [
    'gemini-2.5-flash-lite',
    'gemini-flash-lite-latest',
    'gemini-2.0-flash-lite-001',
  ]
  let sawRateLimit = false
  let lastErrorMessage = 'Failed to fetch AI response.'

  try {
    for (const model of models) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const response = await $fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
            {
              method: 'POST',
              headers: {
                'x-goog-api-key': geminiApiKey,
              },
              body: {
                contents: [
                  {
                    parts: [{ text: prompt }],
                  },
                ],
                generationConfig: {
                  temperature: 0.3,
                  maxOutputTokens: 280,
                },
              },
            }
          )

          const answer = response?.candidates?.[0]?.content?.parts
            ?.map((part) => part?.text || '')
            .join('\n')
            .trim()

          const resolvedAnswer = answer || 'No answer returned from AI.'
          setCachedAnswer(cacheKey, resolvedAnswer)
          return { answer: resolvedAnswer }
        } catch (error) {
          const statusCode = getStatusCode(error)
          lastErrorMessage = getErrorMessage(error)

          if (statusCode === 429) {
            sawRateLimit = true
            if (attempt === 0) {
              await sleep(700)
              continue
            }
            break
          }

          break
        }
      }
    }

    if (sawRateLimit) {
      throw createError({
        statusCode: 429,
        statusMessage: 'Gemini is temporarily rate-limited. Please wait a minute and try again.',
      })
    }

    throw createError({
      statusCode: 502,
      statusMessage: lastErrorMessage || 'Failed to fetch AI response.',
    })
  } catch (error) {
    console.error('Gemini ask-ai error:', error)
    if (error?.statusCode) throw error
    throw createError({
      statusCode: 502,
      statusMessage: getErrorMessage(error),
    })
  }
})
