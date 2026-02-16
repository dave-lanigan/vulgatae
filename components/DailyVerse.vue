<template>
  <div class="mx-auto max-w-full">
    <div class="m-6">
      <h2 class="text-lg sm:text-2xl font-bold font-serif text-primary">Verse of the Day</h2>
    </div>

    <div class="m-6" v-if="verse">
      <!-- Verse card – mirrors Verse.vue layout inside a card -->
      <div class="card w-full bg-transparent shadow-[0_6px_16px_rgba(0,0,0,0.18)] border border-base-300">
        <div class="card-body p-4 sm:p-6">
          <!-- Book name + Date -->
          <div class="flex items-center justify-between mb-2">
            <NuxtLink :to="verseLink" class="text-lg text-secondary font-bold hover:underline">{{ verse.bookTitle }} {{ verse.chapter }}:{{ verse.verse }}</NuxtLink>
            <span class="text-xs text-base-content/50 uppercase tracking-wider">{{ todayFormatted }}</span>
          </div>
          <div class="flex flex-col sm:flex-row items-stretch min-h-full w-full verse-container">

            <!-- Icons Container – desktop: vertical sidebar left, centered; mobile: hidden here -->
            <div class="options-sidebar hidden sm:flex sm:flex-col sm:justify-center gap-2 sm:gap-1 sm:mb-0">
              <div class="sidebar-option cursor-pointer hover:text-blue-600" title="Copy Verse Text" @click="copyVerseText">
                <Icon name="lucide:copy" size="16" :class="copied === 'text' ? 'text-success' : 'text-gray-400 hover:text-blue-600'" />
              </div>
              <div class="sidebar-option cursor-pointer hover:text-blue-600" title="Copy Link to Verse" @click="copyVerseLink">
                <Icon name="lucide:link" size="16" :class="copied === 'link' ? 'text-success' : 'text-gray-400 hover:text-blue-600'" />
              </div>
              <div class="sidebar-option" title="Bookmark" @click="handleBookmarkToggle">
                <Icon
                  name="lucide:bookmark"
                  size="16"
                  :class="bookmarked ? 'text-primary' : 'text-gray-400'"
                />
              </div>
              <div class="sidebar-option" title="Note" @click="openNoteModal">
                <Icon
                  name="lucide:notebook-pen"
                  size="16"
                  :class="hasNoteForVerse ? 'text-primary' : 'text-gray-400'"
                />
              </div>
            </div>

            <!-- Verse Container (same as Verse.vue content) -->
            <div class="verse-content flex-1 flex flex-col justify-between m-4">
              <div class="verse-latin text-right text-2xl sm:text-lg m-4" style="font-size: x-large;">
                {{ verse.latin }}
              </div>
              <div class="verse-english text-left text-xl sm:text-sm m-4" style="font-size: large;">
                {{ verse.english }}
              </div>
            </div>

          </div>
          <!-- Bottom bar: icons (mobile) + Verse link -->
          <div class="flex items-center justify-between mt-2">
            <!-- Mobile icons row -->
            <div class="flex sm:hidden flex-row gap-2">
              <div class="sidebar-option cursor-pointer hover:text-blue-600" title="Copy Verse Text" @click="copyVerseText">
                <Icon name="lucide:copy" size="16" :class="copied === 'text' ? 'text-success' : 'text-gray-400 hover:text-blue-600'" />
              </div>
              <div class="sidebar-option cursor-pointer hover:text-blue-600" title="Copy Link to Verse" @click="copyVerseLink">
                <Icon name="lucide:link" size="16" :class="copied === 'link' ? 'text-success' : 'text-gray-400 hover:text-blue-600'" />
              </div>
              <div class="sidebar-option" title="Bookmark" @click="handleBookmarkToggle">
                <Icon name="lucide:bookmark" size="16" :class="bookmarked ? 'text-primary' : 'text-gray-400'" />
              </div>
              <div class="sidebar-option" title="Note" @click="openNoteModal">
                <Icon name="lucide:notebook-pen" size="16" :class="hasNoteForVerse ? 'text-primary' : 'text-gray-400'" />
              </div>
            </div>
            <!-- Verse link -->
            <NuxtLink :to="verseLink" class="text-sm text-accent font-medium inline-flex items-center gap-1 border-b border-accent pb-0.5 hover:opacity-80 ml-auto">
              Verse <Icon name="material-symbols:arrow-forward" size="14" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="pending" class="m-6">
      <div class="card w-full bg-transparent shadow-[0_6px_16px_rgba(0,0,0,0.18)] border border-base-300">
        <div class="card-body p-4 sm:p-6 animate-pulse">
          <div class="flex flex-col sm:flex-row items-stretch min-h-full w-full">
            <div class="flex flex-row sm:flex-col gap-2 sm:gap-1 sm:mb-0">
              <div class="w-10 h-10 bg-base-300 rounded"></div>
              <div class="w-10 h-10 bg-base-300 rounded"></div>
              <div class="w-10 h-10 bg-base-300 rounded"></div>
            </div>
            <div class="flex-1 m-4 space-y-4">
              <div class="h-6 bg-base-300 rounded w-full"></div>
              <div class="h-5 bg-base-300 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Note Modal -->
    <dialog ref="noteDialog" class="modal">
      <div class="modal-box relative">
        <button class="btn btn-ghost btn-sm btn-circle absolute right-2 top-2" @click="closeNoteModal" aria-label="Close note dialog">
          <Icon name="lucide:x" size="16" />
        </button>
        <h3 class="font-bold text-lg mb-2">Note — {{ verseReference }}</h3>
        <textarea
          v-model="noteText"
          class="textarea textarea-bordered w-full h-32 text-base"
          placeholder="Write your note on this verse…"
        ></textarea>
        <div class="modal-action">
          <button v-if="hasNoteForVerse" class="btn btn-error btn-sm btn-outline mr-auto" @click="handleDeleteNote">
            <Icon name="lucide:trash-2" size="14" />
            Delete
          </button>
          <button class="btn btn-primary btn-outline" @click="handleSaveNote" :disabled="!noteText.trim()">Save</button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'

const { data: verse, pending } = await useFetch('/api/daily-verse')

// Bookmarks
const { toggleBookmark, isBookmarked, load: loadBookmarks } = useBookmarks()
const bookmarked = ref(false)

// Notes
const { saveNote, removeNote, getNote, hasNote, load: loadNotes } = useNotes()
const noteDialog = ref(null)
const noteText = ref('')
const hasNoteForVerse = ref(false)

// Copy feedback
const copied = ref(null)
let copyTimeout = null

// Computed
const verseReference = computed(() => {
  if (!verse.value) return ''
  return `${verse.value.bookTitle} ${verse.value.chapter}:${verse.value.verse}`
})

const verseLink = computed(() => {
  if (!verse.value) return '/'
  return `/books/${verse.value.book}/chapters/${verse.value.chapter}#verse-${verse.value.verse}`
})

const todayFormatted = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })
})

// Bookmark methods
function updateBookmarked() {
  if (!verse.value) return
  bookmarked.value = isBookmarked(verse.value.book, verse.value.chapter, verse.value.verse)
}

async function handleBookmarkToggle() {
  if (!verse.value) return
  await toggleBookmark(verse.value.book, verse.value.chapter, verse.value.verse, {
    latin: verse.value.latin?.substring(0, 80),
    english: verse.value.english?.substring(0, 80)
  })
  updateBookmarked()
}

// Note methods
function updateNoteState() {
  if (!verse.value) return
  hasNoteForVerse.value = hasNote(verse.value.book, verse.value.chapter, verse.value.verse)
}

function openNoteModal() {
  if (!verse.value) return
  const existing = getNote(verse.value.book, verse.value.chapter, verse.value.verse)
  noteText.value = existing?.text || ''
  noteDialog.value?.showModal()
}

function closeNoteModal() {
  noteDialog.value?.close()
}

async function handleSaveNote() {
  if (!verse.value) return
  await saveNote(verse.value.book, verse.value.chapter, verse.value.verse, noteText.value.trim(), {
    latin: verse.value.latin?.substring(0, 80),
    english: verse.value.english?.substring(0, 80)
  })
  updateNoteState()
  closeNoteModal()
}

async function handleDeleteNote() {
  if (!verse.value) return
  await removeNote(verse.value.book, verse.value.chapter, verse.value.verse)
  noteText.value = ''
  updateNoteState()
  closeNoteModal()
}

// Copy methods
function setCopied(type) {
  copied.value = type
  clearTimeout(copyTimeout)
  copyTimeout = setTimeout(() => { copied.value = null }, 2000)
}

async function copyVerseText() {
  if (!verse.value) return
  const text = `${verse.value.latin}\n${verse.value.english}\n— ${verseReference.value}`
  try {
    await navigator.clipboard.writeText(text)
    setCopied('text')
  } catch (err) {
    console.error('Failed to copy verse text:', err)
  }
}

async function copyVerseLink() {
  if (!verse.value) return
  const url = `${window.location.origin}${verseLink.value}`
  try {
    await navigator.clipboard.writeText(url)
    setCopied('link')
  } catch (err) {
    console.error('Failed to copy verse link:', err)
  }
}

// Init
onMounted(async () => {
  await Promise.all([loadBookmarks(), loadNotes()])
  updateBookmarked()
  updateNoteState()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600&family=Crimson+Text:wght@400;600&display=swap');

.verse-container {
  transition: all 0.3s ease;
}

.sidebar-option {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sidebar-option:hover {
  background-color: rgba(0, 0, 0, 0.1);
  transform: scale(1.1);
}

.sidebar-option svg {
  color: #9ca3af; /* Light gray color for icons */
  transition: color 0.2s ease;
}

.sidebar-option:hover svg {
  color: #3b82f6; /* Blue on hover */
}

.verse-latin {
  font-family: 'EB Garamond', serif;
  font-weight: 500;
  letter-spacing: 0.01em;
}

.verse-english {
  font-family: 'Crimson Text', serif;
  letter-spacing: 0.01em;
}

.font-serif {
  font-family: 'EB Garamond', serif;
  letter-spacing: 0.01em;
}
</style>
