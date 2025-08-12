import Database from 'better-sqlite3'

export default defineEventHandler((event) => {
  const { book } = event.context.params;
  
  // Use the runtime config for database path
  const config = useRuntimeConfig()
  const db = new Database(config.public.dbPath)
  
  const stmt = db.prepare(`
    SELECT c.*, c.chapter as number, COUNT(v.chapter) as verseCount
    FROM chapters c
    LEFT JOIN verses v ON c.book = v.book AND c.chapter = v.chapter
    WHERE c.book = ?
    GROUP BY c.chapter
    ORDER BY c.chapter ASC
  `);
  return stmt.all(book);
});
