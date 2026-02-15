import path from 'path'
import fs from 'fs'
import db from '../../dbClient.js'

export default defineEventHandler(async (event) => {
  const { explore } = event.context.params
  const query = getQuery(event)
  const page = Math.max(1, Number(query.page) || 1)
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 30))
  const seed = Number(query.seed) || Date.now()
  const offset = (page - 1) * limit

  if (explore === 'psalms') {
    try {
      const countStmt = db.prepare('SELECT COUNT(*) as total FROM verses WHERE book = 21')
      const { total } = countStmt.get()

      const stmt = db.prepare(`
        SELECT v.*, b.title, b.alt_title, b.title_latin
        FROM verses v
        JOIN books b ON v.book = b.number
        WHERE v.book = 21
        ORDER BY ABS(((v.chapter * 1000 + v.verse) * 1103515245 + ?) % 2147483647), v.chapter, v.verse
        LIMIT ? OFFSET ?
      `)

      const verses = stmt.all(seed, limit, offset)

      return {
        verses,
        total,
        page,
        limit,
        hasMore: offset + verses.length < total,
      }
    } catch (error) {
      console.error('Error loading psalms verses:', error)
      return {
        verses: [],
        total: 0,
        page,
        limit,
        hasMore: false,
      }
    }
  }

  const config = useRuntimeConfig()
  const dbPath = config.public.dbPath
  const filePath = path.resolve(process.cwd(), dbPath, `${explore}.json`)

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const exploreData = JSON.parse(fileContent)

    // Build all verses in a single pass using batch queries
    const results = []

    for (const entry of exploreData) {
      const verse = String(entry.verse)

      if (verse.includes('-')) {
        // Range like "1-6" or "28-30"
        const [start, end] = verse.split('-').map(Number)
        const stmt = db.prepare(`
          SELECT v.*, b.title, b.alt_title, b.title_latin
          FROM verses v
          JOIN books b ON v.book = b.number
          WHERE v.book = ? AND v.chapter = ? AND v.verse >= ? AND v.verse <= ?
          ORDER BY v.verse
        `)
        const rows = stmt.all(entry.bookNumber, entry.chapter, start, end)
        results.push(...rows)
      } else {
        // Single verse
        const stmt = db.prepare(`
          SELECT v.*, b.title, b.alt_title, b.title_latin
          FROM verses v
          JOIN books b ON v.book = b.number
          WHERE v.book = ? AND v.chapter = ? AND v.verse = ?
        `)
        const row = stmt.get(entry.bookNumber, entry.chapter, Number(verse))
        if (row) results.push(row)
      }
    }

    const shuffled = [...results]
    let randomState = seed >>> 0
    const seededRandom = () => {
      randomState = (randomState + 0x6D2B79F5) | 0
      let t = Math.imul(randomState ^ (randomState >>> 15), 1 | randomState)
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }

    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(seededRandom() * (index + 1))
      ;[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]
    }

    const total = shuffled.length
    const verses = shuffled.slice(offset, offset + limit)

    return {
      verses,
      total,
      page,
      limit,
      hasMore: offset + verses.length < total,
    }
  } catch (error) {
    console.error('Error reading explore data:', error)
    return {
      verses: [],
      total: 0,
      page,
      limit,
      hasMore: false,
    }
  }
})
