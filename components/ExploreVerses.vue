<template>
  <div class="w-5/6 xl:w-1/2 flex flex-col items-center font-serif">    

    <!-- <div role="tablist" class="font-serif tabs flex justify-center m-6 p-1 border-1 border-gray-200 rounded-full w-fit shadow-sm">
      <a role="tab" class="tab text-l" :class="{ 'tab-active': activeTab === 'verses' }" @click="activeTab = 'verses'">Verses</a>
      <a role="tab" class="tab text-l" :class="{ 'tab-active': activeTab === 'latin' }" @click="activeTab = 'latin'">Latin</a>
      <a role="tab" class="tab text-l" :class="{ 'tab-active': activeTab === 'english' }" @click="activeTab = 'english'">English</a>
    </div> -->

    <h1 class="text-2xl font-bold m-6 text-center font-serif">{{ versesHeader }}</h1>

    <div v-if="activeTab === 'english'" class="text-justify max-w-4xl mx-auto">
      <p class="text-lg leading-8 font-serif" v-html="englishJoined"></p>
    </div>

    <div v-if="activeTab === 'latin'" class="text-justify max-w-4xl mx-auto">
      <p class="text-lg leading-8 font-serif" v-html="latinJoined"></p>
    </div>

    <div v-if="activeTab === 'verses'" class="">
      <ul class="list-row">
        <li v-for="verse in verses" :key="`${verse.book}-${verse.chapter}-${verse.verse}`" class="list-row border-b border-gray-200 last:border-b-0">
          <Verse :verse="verse" />
        </li>
      </ul>
      <div v-if="pending">Loading...</div>
      <div v-if="isInfiniteCategory && !pending && hasMore" ref="loadMoreTrigger" class="h-1 w-full"></div>
      <div v-if="isInfiniteCategory && !hasMore && verses.length" class="text-sm opacity-70 py-4">No more verses</div>
      <div v-if="error">Error loading verses</div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted } from 'vue';
const route = useRoute()
const explore = route.params.explore
const INFINITE_CATEGORIES = ['comforting', 'instructional']
const isInfiniteCategory = INFINITE_CATEGORIES.includes(explore)
const PAGE_SIZE = 25

const seed = ref(Date.now())
const page = ref(1)
const verses = ref([])
const hasMore = ref(true)
const pending = ref(false)
const error = ref(null)
const loadMoreTrigger = ref(null)
let observer = null

const activeTab = ref('verses')
const versesHeader = computed(() => {
    if (explore=="comforting"){
        return "Comforting words of peace and assurance from the Bible."
    } else if (explore=="instructional"){
        return "Guidance and wisdom for life from the Bible."
    }
}
)

const fetchPage = async () => {
  if (pending.value || !hasMore.value) {
    return
  }

  pending.value = true
  error.value = null

  try {
    const response = await $fetch(`/api/explore/${explore}/verses`, {
      query: {
        page: page.value,
        limit: PAGE_SIZE,
        ...(isInfiniteCategory ? { seed: seed.value } : {})
      }
    })

    const nextVerses = response?.verses || []
    verses.value = page.value === 1 ? nextVerses : [...verses.value, ...nextVerses]
    hasMore.value = Boolean(response?.hasMore)
    page.value += 1
  } catch (fetchError) {
    error.value = fetchError
    hasMore.value = false
  } finally {
    pending.value = false
  }
}

await fetchPage()

const setupObserver = () => {
  if (!isInfiniteCategory || !loadMoreTrigger.value || observer) {
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      const [entry] = entries
      if (entry?.isIntersecting) {
        fetchPage()
      }
    },
    { rootMargin: '400px 0px' }
  )

  observer.observe(loadMoreTrigger.value)
}

onMounted(() => {
  setupObserver()
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})

const englishJoined = computed(() =>
  (verses.value || []).map(v => `${v.english}<sup class="verse-number">[${v.verse}]</sup>`).join(' ')
);
const latinJoined = computed(() =>
  (verses.value || []).map(v => `${v.latin}<sup class="verse-number">[${v.verse}]</sup>`).join(' ')
);
</script>

<style scoped>
.font-serif {
  font-family: 'EB Garamond', serif;
  letter-spacing: 0.01em;
}

.verse-number {
  font-size: 0.7em;
  color: var(--color-accent);
  font-weight: 500;
  margin-left: 0.15rem;
  vertical-align: super;
}

/* Better text readability */
p {
  text-align: justify;
  line-height: 1.8;
  text-indent: 0;
  hyphens: auto;
  word-spacing: 0.05em;
}

/* Responsive text size */
@media (max-width: 768px) {
  p {
    text-align: left;
    font-size: 1rem;
    line-height: 1.7;
  }
}
</style>