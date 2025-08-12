import Database from 'better-sqlite3'
const db = new Database('server/api/v.db')

export default defineEventHandler((event) => {
  const { book } = event.context.params;
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
