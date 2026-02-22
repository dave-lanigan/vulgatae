<template>
  <div class="relative min-h-80 flex items-center justify-center w-full">
    <!-- Background Image -->
    <div class="absolute inset-0 w-full h-full">
      <img 
        src="/assets/img/29603176-7415-4f06-a210-c5b9a0c478ef.png" 
        alt="Medieval Header" 
        class="w-full h-full object-cover"
      />
      <!-- Dimming Overlay -->
      <div class="absolute inset-0 bg-gray-200/80"></div>
    </div>
    
    <!-- Content -->
    <div class="relative z-10 text-center w-full mx-auto px-6 py-8 sm:py-10">
      
      <!-- Title -->
      <h1 class="text-5xl md:text-6xl font-bold text-black font-serif p-4">
        Vulgātae<span class="text-[#b6862c]">.</span>com
      </h1>
      
      <!-- Rotating Subtitle -->
      <div class="text-xl md:text-2xl text-gray-700 mb-6 font-serif min-h-[2rem] transition-opacity duration-300">
        {{ currentRotatingText }}
      </div>
      

      <!-- Search Bar -->
      <div class="relative max-w-3xl mx-auto">
        <div class="flex items-center bg-white/95 rounded-full overflow-hidden shadow-lg ring-1 ring-secondary/25 backdrop-blur-sm transition-all duration-200 focus-within:ring-secondary/45">
          <!-- Search Icon -->
          <button 
            class="pl-5 pr-2 flex items-center h-full hover:opacity-70 transition-opacity cursor-pointer disabled:opacity-50"
            @click="performSearch"
            :disabled="!searchQuery.trim() || isSearching"
          >
            <Icon 
              name="material-symbols:search"
              size="20"
              :style="{ color: 'oklch(28% 0.091 267.935)' }"
            />
          </button>
          <!-- Input Field -->
          <input
            type="text"
            placeholder="Search the Vulgate..."
            class="flex-1 py-3 text-base outline-none placeholder-gray-400 bg-transparent font-serif"
            v-model="searchQuery"
            @keyup.enter="performSearch"
            @input="handleInput"
            @focus="handleFocus"
          />
          <!-- Voice Search -->
          <button
            class="pr-5 pl-2 flex items-center h-full hover:opacity-70 transition-opacity cursor-pointer disabled:opacity-40"
            @click="toggleVoiceSearch"
            :disabled="!supportsVoice"
            :title="supportsVoice ? (isListening ? 'Stop voice search' : 'Start voice search') : 'Voice search unavailable in this browser'"
          >
            <Icon
              name="material-symbols:mic"
              size="20"
              :class="isListening ? 'text-error' : 'text-accent'"
            />
          </button>
        </div>
        
        <!-- Search Results -->
        <div v-if="searchResults.length > 0" class="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50">
          <div class="p-2">
            <div class="text-xs text-gray-500 px-2 py-1">
              Found {{ searchResults.length }} results
            </div>
            <div
              v-for="hit in searchResults"
              :key="hit.objectID || `${hit.book}-${hit.chapter}-${hit.verse}`"
              class="p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 text-left"
            >
              <NuxtLink
                :to="`/books/${hit.book}/chapters/${hit.chapter}#verse-${hit.verse}`"
                class="block"
                @click="clearResults"
              >
                <div class="text-sm font-medium text-blue-900 mb-1">
                  <span v-html="hit._highlightResult?.title?.value || hit.title"></span> {{ hit.chapter }}:{{ hit.verse }}
                </div>
                <div class="text-sm text-gray-700 mb-1" v-html="hit._highlightResult?.latin?.value || hit.latin"></div>
                <div class="text-xs text-gray-500" v-html="hit._highlightResult?.english?.value || hit.english"></div>
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Search History -->
        <div v-else-if="showHistory && searchHistoryList.length > 0" class="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-64 overflow-y-auto z-50">
          <div class="p-2">
            <div class="text-xs text-gray-500 px-2 py-1 font-serif">Recent searches</div>
            <div
              v-for="(term, i) in searchHistoryList"
              :key="i"
              class="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 font-serif flex items-center gap-2"
              @mousedown.prevent="useHistoryItem(term)"
            >
              <Icon name="lucide:history" size="14" class="text-gray-400 flex-shrink-0" />
              {{ term }}
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// Use Algolia index provided by the plugin
const { $searchIndex } = useNuxtApp()

// Search history
const { history: searchHistoryList, addSearchQuery: saveSearch } = useSearchHistory()
const showHistory = ref(false)

const searchQuery = ref('')
const searchResults = ref([])
const isSearching = ref(false)
const supportsVoice = ref(false)
const isListening = ref(false)
let recognition = null
let searchTimeout

// Rotating text functionality
const rotatingTexts = ['vulgatae', '/wʊlˈɡaː.te/', 'vool-GAH-teh']
const currentRotatingText = ref(rotatingTexts[0])
let rotationIndex = 0
let rotationInterval

function rotateText() {
  rotationIndex = (rotationIndex + 1) % rotatingTexts.length
  currentRotatingText.value = rotatingTexts[rotationIndex]
}

const quickSearches = ['amor', 'pax', 'veritas', 'vita', 'lux', 'caritas']

function handleFocus() {
  if (!searchQuery.value.trim() && searchHistoryList.value.length > 0) {
    showHistory.value = true
  }
}

function useHistoryItem(term) {
  searchQuery.value = term
  showHistory.value = false
  performSearch()
}

/**
 * Parse a search query for verse reference patterns.
 * Supports: "Genesis 3:16", "Gen 3", "3:16", "1 John 2:3", "John 1:1-5"
 * Returns { query, filters } for Algolia.
 */
function parseVerseReference(input) {
  const trimmed = input.trim()

  // Pattern: optional book name (may start with a number like "1 John"), then chapter, optional :verse
  // e.g. "Genesis 3:16", "1 John 2:3", "Gen 3", "Exodus 12:1"
  const bookChapterVerse = /^(.+?)\s+(\d+)(?::(\d+))?(?:\s*-\s*\d+)?$/
  // Pattern: just chapter:verse, e.g. "3:16"
  const chapterVerse = /^(\d+):(\d+)(?:\s*-\s*\d+)?$/

  let match

  // Try chapter:verse only (no book name)
  match = trimmed.match(chapterVerse)
  if (match) {
    const filters = [`chapter = ${match[1]}`, `verse = ${match[2]}`]
    return { query: '', filters: filters.join(' AND ') }
  }

  // Try book + chapter + optional verse
  match = trimmed.match(bookChapterVerse)
  if (match) {
    const bookName = match[1].trim()
    const chapter = match[2]
    const verse = match[3]
    const filterParts = [`chapter = ${chapter}`]
    if (verse) filterParts.push(`verse = ${verse}`)
    return { query: bookName, filters: filterParts.join(' AND ') }
  }

  // No verse reference pattern found — plain text search
  return { query: trimmed, filters: null }
}

async function performSearch() {
  if (!$searchIndex || !searchQuery.value.trim() || isSearching.value) return
  isSearching.value = true
  try {
    const { query, filters } = parseVerseReference(searchQuery.value)
    const searchOptions = {
      hitsPerPage: 20,
      attributesToRetrieve: ['book', 'title', 'alt_title', 'latin_title', 'chapter', 'verse', 'latin', 'english'],
      attributesToHighlight: ['title', 'alt_title', 'latin_title', 'latin', 'english'],
      highlightPreTag: '<mark class="bg-amber-200">',
      highlightPostTag: '</mark>'
    }
    if (filters) searchOptions.filters = filters
    const { hits } = await $searchIndex.search(query, searchOptions)
    searchResults.value = hits || []
    // Save to search history
    if (searchResults.value.length > 0) {
      await saveSearch(searchQuery.value)
    }
  } catch (e) {
    console.error('Search error:', e)
    searchResults.value = []
  } finally {
    isSearching.value = false
  }
}

function handleInput() {
  clearTimeout(searchTimeout)
  showHistory.value = false
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }
  searchTimeout = setTimeout(performSearch, 300)
}

function quickSearch(term) {
  searchQuery.value = term
  performSearch()
}

function clearResults() {
  searchResults.value = []
  showHistory.value = false
}

function stopVoiceSearch() {
  if (recognition && isListening.value) {
    recognition.stop()
  }
}

function toggleVoiceSearch() {
  if (!supportsVoice.value || !recognition) return
  if (isListening.value) {
    stopVoiceSearch()
    return
  }
  try {
    recognition.start()
  } catch (_) {
    // Ignore repeated start errors while recognition is already active.
  }
}

function handleDocClick(e) {
  const container = e.target.closest('.relative.max-w-3xl')
  if (!container) clearResults()
}

onMounted(() => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (SpeechRecognition) {
    supportsVoice.value = true
    recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.continuous = false

    recognition.onstart = () => {
      isListening.value = true
    }

    recognition.onresult = async (event) => {
      const transcript = event?.results?.[0]?.[0]?.transcript?.trim()
      if (!transcript) return
      searchQuery.value = transcript
      showHistory.value = false
      await performSearch()
    }

    recognition.onend = () => {
      isListening.value = false
    }

    recognition.onerror = () => {
      isListening.value = false
    }
  }

  document.addEventListener('click', handleDocClick)
  // Start text rotation
  rotationInterval = setInterval(rotateText, 2000)
})

onBeforeUnmount(() => {
  stopVoiceSearch()
  document.removeEventListener('click', handleDocClick)
  // Clear rotation interval
  if (rotationInterval) {
    clearInterval(rotationInterval)
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600&family=Crimson+Text:wght@400;600&display=swap');

.font-serif {
  font-family: 'EB Garamond', serif;
}
</style>
