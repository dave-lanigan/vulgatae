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
        <li v-for="verse in verses" :key="verse.verse" class="list-row border-b border-gray-200 last:border-b-0">
          <Verse :verse="verse" />
        </li>
      </ul>
      <div v-if="pending">Loading...</div>
      <div v-if="error">Error loading verses</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const route = useRoute()
const explore = route.params.explore

const activeTab = ref('verses')
const versesHeader = computed(() => {
    if (explore=="comforting"){
        return "Comforting words of peace and assurance from the Bible."
    } else if (explore=="instructional"){
        return "Guidance and wisdom for life from the Bible."
    }
}
)

const { data: versesInfo, pending, error } = await useFetch(`/api/explore/${explore}`)
const verses = ref([])
if (versesInfo.value) {
    for (const verseInfo of versesInfo.value) {
        const url = `/api/books/${verseInfo.bookNumber}/chapters/${verseInfo.chapter}/verses/${verseInfo.verse}`;
        if (!verseInfo.verse.includes('-')) {
            const verse = await $fetch(url)
            if (verse) {
                console.log(verse);
                verses.value.push(verse)
            }
        }
    }
}
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
  color: #9ca3af; /* gray-400 */
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