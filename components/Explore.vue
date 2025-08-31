<template>
    <div class="mx-auto max-w-full">
        <div class="m-4">
            <h2 class="text-2xl font-bold font-serif text-blue-950">Explore Vulgatae</h2>
        </div>

          <div class="m-6 overflow-x-auto whitespace-nowrap">
            <div class="inline-flex gap-6">
              <div
                v-for="card in cards"
                :key="card.title"
                  class="card w-72 sm:w-80 md:w-80 lg:w-80 bg-base-100 card-xs shadow-sm border border-gray-200 hover:border-blue-950 transition-colors group overflow-hidden inline-block cursor-pointer"
              >
                <NuxtLink :to="`/${card.path}`">
                  <div class="card-body flex flex-col items-start justify-start p-2">
                    <div class="flex flex-row items-center w-full mb-2">
                      <h2 class="card-title text-left text-xs sm:text-base md:text-lg flex-1 text-blue-950">{{ card.title }}</h2>
                      <Icon :name="card.icon" size="24" class="text-teal-600 ml-2 transition-color group-hover:text-blue-950 flex-shrink-0" />
                    </div>
                    <p class="text-left text-[10px] sm:text-xs md:text-sm w-full">{{ card.description }}</p>
                </div>
              </NuxtLink>
              </div>
            </div>
          </div>
    </div>
</template>

<script setup>
const cards = [
  // {
  //   title: 'Inspirational Verses',
  //   icon: 'mdi:lightbulb-on-outline',
  //   description: 'Uplifting and motivating passages.',
  //   path: 'explore/inspirational'
  // },
  {
    title: 'Comforting Verses',
    icon: 'material-symbols:favorite',
    description: 'Words of peace and reassurance.',
    path: 'explore/comforting'
  },
  {
    title: 'Pray the Psalms',
    icon: 'mdi:hands-pray',
    description: 'Classic prayers from the Psalms.',
    path: 'books/21/chapters'

  },
  {
    title: 'Instructional Verses',
    icon: 'mdi:book-open-blank-variant-outline',
    description: 'Guidance and wisdom for life.',
    path: 'explore/instructional'
  }
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600&family=Crimson+Text:wght@400;600&display=swap');

.font-serif {
  font-family: 'EB Garamond', serif;
}
</style>
