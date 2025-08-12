import Database from 'better-sqlite3'

export default defineEventHandler((event) => {
  const { book, chapter, verse } = event.context.params
  
  // Use the runtime config for database path
  const config = useRuntimeConfig()
  const db = new Database(config.public.dbPath)
  
  const stmt = db.prepare(`
    SELECT *
    FROM verses
    WHERE book = ? AND chapter = ? AND verse = ?
  `)
  return stmt.get(book, chapter, verse)
})
