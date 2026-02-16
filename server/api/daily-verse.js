import db from './dbClient.js'

/**
 * Returns a deterministic "verse of the day" based on the current UTC date.
 * The seed rotates through every verse in the database across days.
 */
export default defineEventHandler(() => {
  // Total number of verses in the Bible
  const { total } = db.prepare('SELECT COUNT(*) as total FROM verses').get()

  // Deterministic day index (days since epoch, UTC)
  const now = new Date()
  const dayIndex = Math.floor(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 86400000)

  // Use a simple hash-like rotation so consecutive days don't yield adjacent verses
  // Multiply by a large prime and mod by total to scatter across the Bible
  const offset = ((dayIndex * 2654435761) >>> 0) % total

  // Grab the verse at that offset using rowid ordering
  const verse = db.prepare(`
    SELECT v.*, b.title as bookTitle, b.title_latin as bookTitleLatin
    FROM verses v
    JOIN books b ON v.book = b.number
    LIMIT 1 OFFSET ?
  `).get(offset)

  return verse
})
