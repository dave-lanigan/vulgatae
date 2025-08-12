import Database from 'better-sqlite3'
const db = new Database('server/api/v.db')

export default defineEventHandler((event) => {
  const { book, chapter } = event.context.params
  const stmt = db.prepare(`
    SELECT *, verses.verse as number
    FROM verses
    WHERE book = ? AND chapter = ?
  `)
  return stmt.all(book, chapter)
})
