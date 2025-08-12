import Database from 'better-sqlite3'
const db = new Database('server/api/v.db')

export default defineEventHandler((event) => {
  const { book } = event.context.params
  const result = db.prepare('SELECT * FROM books WHERE number = ?').get(book)
  
  if (!result) {
    return null
  }
  
  // Map database column names to frontend property names
  return {
    number: result.number,
    title: result.title,
    titleLatin: result.title_latin,
    altTitle: result.alt_title,
    numberOfChapters: result.number_of_chapters,
    numberOfVerses: result.number_of_verses
  }
})
