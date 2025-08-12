<template>
  <div class="drawer">
    <input id="bible-drawer" type="checkbox" class="drawer-toggle" ref="drawerToggle" />
    <div class="drawer-content bg-base-100">
      <!-- Page content here -->
      <slot />
    </div>
    <div class="drawer-side">
      <label for="bible-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
            <div class="menu bg-base-200 text-base-content min-h-full w-80 p-4 flex flex-col">
        <!-- Bible Navigation -->
        <div class="mb-4 flex-shrink-0">
          <h2 class="text-lg font-bold mb-2">Vulgate Bible</h2>
          <div class="form-control">
            <input 
              type="text" 
              placeholder="Search books..." 
              class="input input-bordered input-sm mb-3"
              v-model="searchQuery"
            />
          </div>
        </div>
        
        <!-- Loading state -->
        <div v-if="booksLoading" class="flex justify-center flex-1">
          <span class="loading loading-spinner loading-md"></span>
        </div>
        
        <!-- Books list -->
        <div v-else-if="books" class="space-y-1 flex-1 overflow-y-auto">
          <div class="text-xs text-gray-500 mb-2">Found {{ filteredBooks.length }} books</div>
          <div v-for="book in filteredBooks" :key="book.number" class="border border-base-300 rounded-lg mb-2">
            <div 
              @click="toggleBook(book.number)" 
              class="cursor-pointer hover:bg-base-300 p-3 flex items-center justify-between"
            >
              <div class="flex items-center">
                <Icon :name="expandedBooks[book.number] ? 'lucide:chevron-up' : 'lucide:chevron-down'" size="16" class="mr-2" />
                <span class="text-xs font-medium">{{ book.title }} ({{ book.number }})</span>
              </div>
              <span class="badge badge-xs">{{ getChapterCount(book.number) }}</span>
            </div>
            
            <div v-if="expandedBooks[book.number]" class="p-2 border-t border-base-300">
              <div v-if="loadingChapters[book.number]" class="flex justify-center py-2">
                <span class="loading loading-spinner loading-sm"></span>
              </div>
              <div v-else-if="chapters[book.number]" class="space-y-1">
                <div class="text-xs text-gray-500 mb-1">{{ chapters[book.number].length }} chapters</div>
                <div v-for="chapter in chapters[book.number]" :key="chapter.number" 
                     class="border border-base-200 rounded mb-1">
                  <div 
                    @click="toggleChapter(book.number, chapter.number)"
                    class="cursor-pointer hover:bg-base-200 p-2 flex items-center justify-between"
                  >
                    <div class="flex items-center">
                      <Icon :name="expandedChapters[`${book.number}-${chapter.number}`] ? 'lucide:chevron-up' : 'lucide:chevron-down'" size="14" class="mr-1" />
                      <span class="text-xs">Chapter {{ chapter.number }}</span>
                    </div>
                    <span class="badge badge-xs">{{ getVerseCount(book.number, chapter.number) }}</span>
                  </div>
                  
                  <div v-if="expandedChapters[`${book.number}-${chapter.number}`]" class="p-2 border-t border-base-200">
                    <div v-if="loadingVerses[`${book.number}-${chapter.number}`]" class="flex justify-center py-1">
                      <span class="loading loading-spinner loading-xs"></span>
                    </div>
                    <div v-else-if="verses[`${book.number}-${chapter.number}`]" class="space-y-1">
                      <div class="text-xs text-gray-500 mb-1">{{ verses[`${book.number}-${chapter.number}`].length }} verses</div>
                      <div v-for="verse in verses[`${book.number}-${chapter.number}`]" :key="verse.number" 
                           class="border border-base-100 rounded">
                        <NuxtLink 
                          :to="`/books/${book.number}/chapters/${chapter.number}#verse-${verse.number}`"
                          class="cursor-pointer hover:bg-base-100 p-2 flex items-start w-full text-left"
                          @click="closeDrawer"
                        >
                          <span class="text-xs">
                            <span class="font-bold">{{ verse.number }}</span>
                            <span class="italic ml-1">{{ verse.english?.split(' ').slice(0, 4).join(' ') }}...</span>
                          </span>
                        </NuxtLink>
                      </div>
                    </div>
                    <div v-else class="text-xs text-gray-500 py-1">
                      Click to load verses
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-xs text-gray-500 py-1">
                Click to load chapters
              </div>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="mt-auto pt-4 border-t flex-shrink-0">
          <NuxtLink to="/" class="btn btn-sm btn-ghost w-full" @click="closeDrawer">
            <Icon name="lucide:home" size="16" />
            Home
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Reactive data
const searchQuery = ref('')
const drawerToggle = ref(null)
const books = ref(null)
const booksLoading = ref(true)
const chapters = ref({})
const loadingChapters = ref({})
const verses = ref({})
const loadingVerses = ref({})
const expandedBooks = ref({})
const expandedChapters = ref({})

// Fetch books on mount
onMounted(async () => {
  try {
    books.value = await $fetch('/api/books')
    console.log('Books loaded:', books.value.length, books.value)
  } catch (error) {
    console.error('Error loading books:', error)
  } finally {
    booksLoading.value = false
  }
})

// Computed filtered books
const filteredBooks = computed(() => {
  if (!books.value) return []
  if (!searchQuery.value) return books.value
  
  return books.value.filter(book => 
    book.short.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Method to load chapters for a book
const loadChapters = async (bookNumber) => {
  console.log('loadChapters called with bookNumber:', bookNumber, typeof bookNumber)
  
  if (chapters.value[bookNumber]) {
    console.log('Chapters already loaded for book', bookNumber)
    return // Already loaded
  }
  
  console.log('Loading chapters for book:', bookNumber)
  loadingChapters.value[bookNumber] = true
  
  try {
    const data = await $fetch(`/api/books/${bookNumber}/chapters`)
    chapters.value[bookNumber] = data
  } catch (error) {
    console.error('Error loading chapters:', error)
  } finally {
    loadingChapters.value[bookNumber] = false
  }
}

// Method to load verses for a chapter
const loadVerses = async (bookNumber, chapterNumber) => {
  const key = `${bookNumber}-${chapterNumber}`
  if (verses.value[key]) return // Already loaded
  
  console.log('Loading verses for book:', bookNumber, 'chapter:', chapterNumber)
  loadingVerses.value[key] = true
  
  try {
    const data = await $fetch(`/api/books/${bookNumber}/chapters/${chapterNumber}`)
    console.log(`Verses loaded for book ${bookNumber} chapter ${chapterNumber}:`, data.length, data)
    verses.value[key] = data
  } catch (error) {
    console.error('Error loading verses:', error)
  } finally {
    loadingVerses.value[key] = false
  }
}

// Helper to get chapter count
const getChapterCount = (bookNumber) => {
  const bookChapters = chapters.value[bookNumber]
  return bookChapters ? bookChapters.length : '...'
}

// Helper to get verse count
const getVerseCount = (bookNumber, chapterNumber) => {
  const key = `${bookNumber}-${chapterNumber}`
  const chapterVerses = verses.value[key]
  return chapterVerses ? chapterVerses.length : '...'
}

// Method to close drawer
const closeDrawer = () => {
  if (drawerToggle.value) {
    drawerToggle.value.checked = false
  }
}

// Toggle methods for expand/collapse
const toggleBook = (bookNumber) => {
  expandedBooks.value[bookNumber] = !expandedBooks.value[bookNumber]
  if (expandedBooks.value[bookNumber] && !chapters.value[bookNumber]) {
    loadChapters(bookNumber)
  }
}

const toggleChapter = (bookNumber, chapterNumber) => {
  const key = `${bookNumber}-${chapterNumber}`
  expandedChapters.value[key] = !expandedChapters.value[key]
  if (expandedChapters.value[key] && !verses.value[key]) {
    loadVerses(bookNumber, chapterNumber)
  }
}

// Expose methods for parent components
defineExpose({
  openDrawer: () => {
    if (drawerToggle.value) {
      drawerToggle.value.checked = true
    }
  },
  closeDrawer
})
</script>

<style scoped>
.drawer-toggle:checked ~ .drawer-side {
  transform: translateX(0);
}

.drawer-side {
  z-index: 9999;
}

.drawer-overlay {
  z-index: 9997;
  /* Customize overlay opacity - default is usually 0.5 */
  background-color: rgba(0, 0, 0, 0.2); /* Lighter overlay */
}

.menu {
  z-index: 9999;
  position: relative;
}

.collapse input[type="checkbox"]:checked ~ .collapse-content {
  max-height: 200px;
}

/* Custom scrollbar for the books list */
.flex-1::-webkit-scrollbar {
  width: 4px;
}

.flex-1::-webkit-scrollbar-track {
  background: transparent;
}

.flex-1::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 2px;
}

.flex-1::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.7);
}
</style>
