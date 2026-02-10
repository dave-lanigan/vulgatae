import path from 'path'
import fs from 'fs'
import db from '../../dbClient.js'

export default defineEventHandler(async (event) => {
  const { explore } = event.context.params
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

    return results
  } catch (error) {
    console.error('Error reading explore data:', error)
    return []
  }
})
