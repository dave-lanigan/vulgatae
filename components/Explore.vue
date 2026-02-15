<template>
    <div class="mx-auto max-w-full">
        <div class="m-4">
          <h2 class="text-2xl font-bold font-serif text-primary">Explore Vulgatae</h2>
        </div>

          <div class="m-6 overflow-x-auto whitespace-nowrap">
            <div class="inline-flex gap-6">
              <div
                v-for="card in cards"
                :key="card.title"
                class="card w-72 sm:w-80 md:w-80 lg:w-80 h-44 bg-transparent shadow-md border border-base-300 transition-colors group overflow-hidden inline-block cursor-pointer"
              >
                <NuxtLink :to="`/${card.path}`" class="h-full">
                  <div class="card-body flex flex-col items-start justify-between p-4 h-full">
                    <div class="w-full">
                      <div class="w-full mb-2">
                        <h2 class="card-title text-left text-primary text-lg font-bold leading-tight mb-1">{{ card.title }}</h2>
                        <span class="text-xs uppercase tracking-wider text-secondary">{{ card.category }}</span>
                      </div>
                      <p class="text-left w-full text-sm text-base-content/75 mb-2 line-clamp-1">{{ card.description }}</p>
                    </div>

                    <div class="w-full mt-auto">
                      <div class="pl-3 mb-2">
                        <p class="text-xs italic text-base-content/60 font-serif leading-relaxed line-clamp-1">{{ card.latinQuote }}</p>
                        <p class="text-xs text-base-content/45 truncate">— {{ card.quoteSource }}</p>
                      </div>

                      <div class="flex items-center justify-between w-full">
                        <span class="text-xs text-accent font-medium">{{ card.verseCount }}</span>
                        <span class="text-xs text-base-content/70 transition-colors group-hover:text-primary">Open verses</span>
                      </div>
                    </div>
                  </div>
                </NuxtLink>
              </div>
            </div>
          </div>
    </div>
</template>

<script setup>
const { getChapter } = useDailyPsalm()
const dailyPsalmChapter = getChapter()

const cards = [
  {
    title: 'Words of Comfort',
    description: 'Words of peace and reassurance from Scripture to bring comfort in times of trial.',
    path: 'explore/comforting',
    category: 'Devotional',
    latinQuote: 'Dominus illuminatio mea.',
    quoteSource: 'Psalmus 27:1',
    verseCount: '85+ verses',
  },
  {
    title: 'Daily Psalms',
    path: `books/21/chapters/${dailyPsalmChapter}`,
    description: 'Pray through the timeless poetry of the Psalms — one chapter each day.',
    category: 'Prayer',
    latinQuote: 'Cantate Domino canticum novum.',
    quoteSource: 'Psalmus 96:1',
    verseCount: '150 psalms',
  },
  {
    title: 'Words of Wisdom',
    description: 'Guidance and wisdom for daily life drawn from Proverbs, Sirach, and beyond.',
    path: 'explore/instructional',
    category: 'Wisdom',
    latinQuote: 'Initium sapientiae timor Domini.',
    quoteSource: 'Proverbia 9:10',
    verseCount: '90+ verses',
  }
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600&family=Crimson+Text:wght@400;600&display=swap');

.font-serif {
  font-family: 'EB Garamond', serif;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
