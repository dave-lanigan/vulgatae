import { createStorage } from 'unstorage'
import localStorageDriver from 'unstorage/drivers/localstorage'

// Single storage instance — swap this driver to change backend
// Phase 1: localStorage (browser-only)
// Phase 2: Replace with HTTP driver → Nitro API → Supabase/Firestore/etc.
let storage = null

function getStorage() {
  if (!storage) {
    storage = createStorage({
      driver: localStorageDriver({ base: 'vulgatae:' })
    })
  }
  return storage
}

// ── Keys ──────────────────────────────────────────────────────
const KEYS = {
  bookmarks: 'bookmarks',
  readProgress: 'readProgress',
  lastReadVerse: 'lastReadVerse',
  searchHistory: 'searchHistory',
  notes: 'notes',
  theme: 'preferences:theme'
}

const MAX_SEARCH_HISTORY = 20

// ── Bookmarks ─────────────────────────────────────────────────

/**
 * Build a unique verse identifier string.
 * @param {number|string} book
 * @param {number|string} chapter
 * @param {number|string} verse
 */
function verseId(book, chapter, verse) {
  return `${book}-${chapter}-${verse}`
}

// Shared state – all components see the same bookmarks
const _bookmarks = ref([])
let _bookmarksLoadPromise = null

function _loadBookmarks() {
  if (!import.meta.client) return Promise.resolve()
  if (!_bookmarksLoadPromise) {
    _bookmarksLoadPromise = getStorage()
      .getItem(KEYS.bookmarks)
      .then(stored => { _bookmarks.value = stored || [] })
  }
  return _bookmarksLoadPromise
}

export function useBookmarks() {
  const bookmarks = _bookmarks

  async function load() {
    return _loadBookmarks()
  }

  async function addBookmark(book, chapter, verse, meta = {}) {
    if (!import.meta.client) return
    await _loadBookmarks()
    const id = verseId(book, chapter, verse)
    const exists = bookmarks.value.some(b => b.id === id)
    if (exists) return
    const entry = { id, book, chapter, verse, ...meta, savedAt: Date.now() }
    bookmarks.value.push(entry)
    await getStorage().setItem(KEYS.bookmarks, bookmarks.value)
  }

  async function removeBookmark(book, chapter, verse) {
    if (!import.meta.client) return
    await _loadBookmarks()
    const id = verseId(book, chapter, verse)
    bookmarks.value = bookmarks.value.filter(b => b.id !== id)
    await getStorage().setItem(KEYS.bookmarks, bookmarks.value)
  }

  async function toggleBookmark(book, chapter, verse, meta = {}) {
    await _loadBookmarks()
    const id = verseId(book, chapter, verse)
    if (bookmarks.value.some(b => b.id === id)) {
      await removeBookmark(book, chapter, verse)
    } else {
      await addBookmark(book, chapter, verse, meta)
    }
  }

  function isBookmarked(book, chapter, verse) {
    const id = verseId(book, chapter, verse)
    return bookmarks.value.some(b => b.id === id)
  }

  // Auto-load on client
  if (import.meta.client) {
    _loadBookmarks()
  }

  return { bookmarks, addBookmark, removeBookmark, toggleBookmark, isBookmarked, load }
}

// ── Reading Progress ──────────────────────────────────────────

export function useReadingProgress() {
  const readChapters = ref([])

  async function load() {
    if (!import.meta.client) return
    const stored = await getStorage().getItem(KEYS.readProgress)
    readChapters.value = stored || []
  }

  async function markChapterRead(book, chapter) {
    if (!import.meta.client) return
    const id = `${book}-${chapter}`
    const exists = readChapters.value.some(r => r.id === id)
    if (exists) return
    readChapters.value.push({ id, book, chapter, readAt: Date.now() })
    await getStorage().setItem(KEYS.readProgress, readChapters.value)
  }

  function isChapterRead(book, chapter) {
    const id = `${book}-${chapter}`
    return readChapters.value.some(r => r.id === id)
  }

  if (import.meta.client) {
    load()
  }

  return { readChapters, markChapterRead, isChapterRead, load }
}

// ── Last Read Verse ─────────────────────────────────────────

const _lastReadVerse = ref(null)
let _lastReadVerseLoadPromise = null

function _loadLastReadVerse() {
  if (!import.meta.client) return Promise.resolve()
  if (!_lastReadVerseLoadPromise) {
    _lastReadVerseLoadPromise = getStorage()
      .getItem(KEYS.lastReadVerse)
      .then(stored => { _lastReadVerse.value = stored || null })
  }
  return _lastReadVerseLoadPromise
}

export function useLastReadVerse() {
  const lastReadVerse = _lastReadVerse

  async function load() {
    return _loadLastReadVerse()
  }

  async function setLastReadVerse(book, chapter, verse, meta = {}) {
    if (!import.meta.client) return
    await _loadLastReadVerse()
    lastReadVerse.value = {
      id: verseId(book, chapter, verse),
      book,
      chapter,
      verse,
      ...meta,
      updatedAt: Date.now()
    }
    await getStorage().setItem(KEYS.lastReadVerse, lastReadVerse.value)
  }

  async function clearLastReadVerse() {
    if (!import.meta.client) return
    lastReadVerse.value = null
    await getStorage().setItem(KEYS.lastReadVerse, null)
  }

  if (import.meta.client) {
    _loadLastReadVerse()
  }

  return { lastReadVerse, setLastReadVerse, clearLastReadVerse, load }
}

// ── Search History ────────────────────────────────────────────

export function useSearchHistory() {
  const history = ref([])

  async function load() {
    if (!import.meta.client) return
    const stored = await getStorage().getItem(KEYS.searchHistory)
    history.value = stored || []
  }

  async function addSearchQuery(query) {
    if (!import.meta.client) return
    const trimmed = query.trim()
    if (!trimmed) return
    // Remove duplicate if exists, then prepend
    history.value = history.value.filter(q => q !== trimmed)
    history.value.unshift(trimmed)
    // Cap the list
    if (history.value.length > MAX_SEARCH_HISTORY) {
      history.value = history.value.slice(0, MAX_SEARCH_HISTORY)
    }
    await getStorage().setItem(KEYS.searchHistory, history.value)
  }

  async function clearHistory() {
    if (!import.meta.client) return
    history.value = []
    await getStorage().setItem(KEYS.searchHistory, [])
  }

  if (import.meta.client) {
    load()
  }

  return { history, addSearchQuery, clearHistory, load }
}

// ── Notes ─────────────────────────────────────────────────────

// Shared state – all components see the same notes
const _notes = ref([])
let _notesLoadPromise = null

function _loadNotes() {
  if (!import.meta.client) return Promise.resolve()
  if (!_notesLoadPromise) {
    _notesLoadPromise = getStorage()
      .getItem(KEYS.notes)
      .then(stored => { _notes.value = stored || [] })
  }
  return _notesLoadPromise
}

export function useNotes() {
  const notes = _notes

  async function load() {
    return _loadNotes()
  }

  async function saveNote(book, chapter, verse, text, meta = {}) {
    if (!import.meta.client) return
    await _loadNotes()
    const id = verseId(book, chapter, verse)
    const existing = notes.value.findIndex(n => n.id === id)
    const entry = { id, book, chapter, verse, text, ...meta, updatedAt: Date.now() }
    if (existing >= 0) {
      notes.value[existing] = entry
    } else {
      entry.createdAt = Date.now()
      notes.value.push(entry)
    }
    await getStorage().setItem(KEYS.notes, notes.value)
  }

  async function removeNote(book, chapter, verse) {
    if (!import.meta.client) return
    await _loadNotes()
    const id = verseId(book, chapter, verse)
    notes.value = notes.value.filter(n => n.id !== id)
    await getStorage().setItem(KEYS.notes, notes.value)
  }

  function getNote(book, chapter, verse) {
    const id = verseId(book, chapter, verse)
    return notes.value.find(n => n.id === id) || null
  }

  function hasNote(book, chapter, verse) {
    const id = verseId(book, chapter, verse)
    return notes.value.some(n => n.id === id)
  }

  if (import.meta.client) {
    _loadNotes()
  }

  return { notes, saveNote, removeNote, getNote, hasNote, load }
}

// ── Theme Preference ──────────────────────────────────────────

export function useThemePreference() {
  const theme = useState('theme', () => 'vulgatae-light')

  async function load() {
    if (!import.meta.client) return
    const stored = await getStorage().getItem(KEYS.theme)
    if (stored) {
      theme.value = stored
    }
  }

  async function setTheme(newTheme) {
    theme.value = newTheme
    if (!import.meta.client) return
    await getStorage().setItem(KEYS.theme, newTheme)
  }

  if (import.meta.client) {
    load()
  }

  return { theme, setTheme, load }
}
