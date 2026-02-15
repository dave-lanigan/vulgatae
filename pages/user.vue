<template>
  <div class="min-h-screen">

    <!-- Top bar matching other pages -->
    <div class="pt-4 pb-4 bg-white shadow-md">
      <div class="mx-auto flex items-center justify-between w-full max-w-screen-lg px-4">
        <NuxtLink to="/" class="btn btn-ghost text-xs sm:text-sm">
          <Icon name="material-symbols:arrow-back" size="20" />
          <span class="hidden sm:inline">Home</span>
        </NuxtLink>
        <h1 class="font-bold text-xl text-center">Your Library</h1>
        <div class="w-16" /> <!-- spacer -->
      </div>
    </div>

    <!-- Tabs -->
    <div class="mx-auto max-w-screen-lg px-4 mt-6">
      <div class="tabs tabs-lift w-full">
        <label class="tab flex-1" v-for="tabItem in tabs" :key="tabItem.key">
          <input type="radio" name="library_tabs" :checked="activeTab === tabItem.key" @change="activeTab = tabItem.key" />
          <Icon :name="tabItem.icon" class="size-4 me-2" />
          {{ tabItem.label }}
        </label>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="mx-auto max-w-screen-lg px-4 py-6">

      <!-- ─── Bookmarked ─── -->
      <div v-if="activeTab === 'bookmarked'">
        <div v-if="bookmarks.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
          <Icon name="lucide:bookmark" size="40" class="text-base-content/20 mb-3" />
          <p class="text-base-content/50">No bookmarks yet.</p>
          <p class="text-base-content/30 text-sm mt-1">Tap the bookmark icon on any verse to save it here.</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="bm in sortedBookmarks"
            :key="bm.id"
            class="flex items-start gap-4 p-4 rounded-lg bg-transparent border-2 border-[#f3f4f6] hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer group"
          >
            <NuxtLink
              :to="`/books/${bm.book}/chapters/${bm.chapter}#verse-${bm.verse}`"
              class="flex-1 min-w-0"
            >
              <div class="flex items-center gap-2 mb-1">
                <span class="badge badge-primary badge-sm font-mono">{{ bm.chapter }}:{{ bm.verse }}</span>
                <span class="text-sm font-semibold text-base-content/80">Book {{ bm.book }}</span>
              </div>
              <p v-if="bm.latin" class="text-sm italic text-base-content/60 leading-snug line-clamp-1">
                {{ bm.latin }}…
              </p>
              <p v-if="bm.english" class="text-sm text-base-content/45 leading-snug line-clamp-1 mt-0.5">
                {{ bm.english }}…
              </p>
            </NuxtLink>
            <button
              class="btn btn-ghost btn-sm btn-square opacity-0 group-hover:opacity-100 transition-opacity shrink-0 self-center"
              title="Remove bookmark"
              @click="handleRemoveBookmark(bm)"
            >
              <Icon name="lucide:trash-2" size="14" class="text-error/60" />
            </button>
          </div>
        </div>
      </div>

      <!-- ─── Progress ─── -->
      <div v-if="activeTab === 'progress'">
        <div v-if="readChapters.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
          <Icon name="lucide:book-open-check" size="40" class="text-base-content/20 mb-3" />
          <p class="text-base-content/50">No chapters marked as read yet.</p>
          <p class="text-base-content/30 text-sm mt-1">Your reading progress will appear here.</p>
        </div>

        <div v-else class="space-y-5">
          <div v-for="(chapters, bookNum) in groupedProgress" :key="bookNum" class="p-4 rounded-lg bg-transparent border-2 border-[#f3f4f6]">
            <h3 class="text-sm font-bold tracking-wide uppercase text-base-content/50 mb-2">
              Book {{ bookNum }}
            </h3>
            <div class="flex flex-wrap gap-2">
              <NuxtLink
                v-for="ch in chapters"
                :key="ch.id"
                :to="`/books/${ch.book}/chapters/${ch.chapter}`"
                class="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-success/10 text-success border border-success/20 hover:bg-success hover:text-success-content transition-colors"
              >
                <Icon name="lucide:check" size="12" />
                Ch. {{ ch.chapter }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- ─── Notes ─── -->
      <div v-if="activeTab === 'notes'">
        <div v-if="notes.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
          <Icon name="lucide:notebook-pen" size="40" class="text-base-content/20 mb-3" />
          <p class="text-base-content/50">No notes yet.</p>
          <p class="text-base-content/30 text-sm mt-1">Tap the note icon on any verse to add your thoughts.</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="note in sortedNotes"
            :key="note.id"
            class="flex items-start gap-4 p-4 rounded-lg bg-transparent border-2 border-[#f3f4f6] hover:border-primary/30 hover:shadow-sm transition-all group"
          >
            <NuxtLink
              :to="`/books/${note.book}/chapters/${note.chapter}#verse-${note.verse}`"
              class="flex-1 min-w-0"
            >
              <div class="flex items-center gap-2 mb-1">
                <span class="badge badge-info badge-sm font-mono">{{ note.chapter }}:{{ note.verse }}</span>
                <span class="text-sm font-semibold text-base-content/80">Book {{ note.book }}</span>
              </div>
              <p class="text-sm text-base-content/80 leading-snug line-clamp-3 mt-1">
                {{ note.text }}
              </p>
              <p v-if="note.latin" class="text-xs italic text-base-content/40 mt-2 line-clamp-1">
                {{ note.latin }}…
              </p>
            </NuxtLink>
            <button
              class="btn btn-ghost btn-sm btn-square opacity-0 group-hover:opacity-100 transition-opacity shrink-0 self-center"
              title="Remove note"
              @click="handleRemoveNote(note)"
            >
              <Icon name="lucide:trash-2" size="14" class="text-error/60" />
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
useHead({ title: 'Your Library – Vulgatae' })

// Composables
const { bookmarks, removeBookmark } = useBookmarks()
const { readChapters } = useReadingProgress()
const { history, clearHistory } = useSearchHistory()
const { theme, setTheme } = useThemePreference()
const { notes, removeNote } = useNotes()

// Tab state
const activeTab = ref('bookmarked')

const tabs = computed(() => [
  { key: 'bookmarked', label: 'Bookmarked', icon: 'lucide:bookmark', count: bookmarks.value.length },
  { key: 'progress',   label: 'Progress',   icon: 'lucide:book-open-check', count: readChapters.value.length },
  { key: 'notes',      label: 'Notes',      icon: 'lucide:notebook-pen', count: notes.value.length },
])

// Sorted bookmarks (most recent first)
const sortedBookmarks = computed(() =>
  [...bookmarks.value].sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0))
)

// Sorted notes (most recently updated first)
const sortedNotes = computed(() =>
  [...notes.value].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
)

// Group reading progress by book number
const groupedProgress = computed(() => {
  const groups = {}
  for (const entry of readChapters.value) {
    if (!groups[entry.book]) groups[entry.book] = []
    groups[entry.book].push(entry)
  }
  for (const book in groups) {
    groups[book].sort((a, b) => a.chapter - b.chapter)
  }
  return groups
})

async function handleRemoveBookmark(bm) {
  await removeBookmark(bm.book, bm.chapter, bm.verse)
}

async function handleRemoveNote(note) {
  await removeNote(note.book, note.chapter, note.verse)
}

async function handleClearHistory() {
  await clearHistory()
}
</script>
