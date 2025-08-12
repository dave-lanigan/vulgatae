import Database from 'better-sqlite3'

export default defineEventHandler((event) => {
  const { book, chapter } = event.context.params
  
  // Use the runtime config for database path
  const config = useRuntimeConfig()
  const db = new Database(config.public.dbPath)
  
  const stmt = db.prepare(`
    SELECT *, verses.verse as number
    FROM verses
    WHERE book = ? AND chapter = ?
  `)
  return stmt.all(book, chapter)
})
