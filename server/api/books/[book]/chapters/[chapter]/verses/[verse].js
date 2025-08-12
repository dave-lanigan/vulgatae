import db from '../../../../../dbClient.js'

export default defineEventHandler((event) => {
  const { book, chapter, verse } = event.context.params
  
  const stmt = db.prepare(`
    SELECT *
    FROM verses
    WHERE book = ? AND chapter = ? AND verse = ?
  `)
  return stmt.get(book, chapter, verse)
})
