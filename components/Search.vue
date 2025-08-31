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
    <div class="relative z-10 text-center w-full mx-auto px-6">
      
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
        <div class="flex items-center bg-white rounded-full overflow-hidden">
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
            class="flex-1 py-2 text-base outline-none placeholder-gray-400 bg-transparent font-serif"
            v-model="searchQuery"
            @keyup.enter="performSearch"
            @input="handleInput"
          />
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
                  {{ hit.book }} {{ hit.chapter }}:{{ hit.verse }}
                </div>
                <div class="text-sm text-gray-700 mb-1" v-html="hit._highlightResult?.latin?.value || hit.latin"></div>
                <div class="text-xs text-gray-500" v-html="hit._highlightResult?.english?.value || hit.english"></div>
              </NuxtLink>
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

const searchQuery = ref('')
const searchResults = ref([])
const isSearching = ref(false)
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

async function performSearch() {
  if (!$searchIndex || !searchQuery.value.trim() || isSearching.value) return
  isSearching.value = true
  try {
    const { hits } = await $searchIndex.search(searchQuery.value, {
      hitsPerPage: 20,
      attributesToRetrieve: ['book', 'chapter', 'verse', 'latin', 'english'],
      attributesToHighlight: ['latin', 'english'],
      highlightPreTag: '<mark class="bg-amber-200">',
      highlightPostTag: '</mark>'
    })
    searchResults.value = hits || []
  } catch (e) {
    console.error('Search error:', e)
    searchResults.value = []
  } finally {
    isSearching.value = false
  }
}

function handleInput() {
  clearTimeout(searchTimeout)
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
}

function handleDocClick(e) {
  const container = e.target.closest('.relative.max-w-3xl')
  if (!container) clearResults()
}

onMounted(() => {
  document.addEventListener('click', handleDocClick)
  // Start text rotation
  rotationInterval = setInterval(rotateText, 2000)
})

onBeforeUnmount(() => {
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
