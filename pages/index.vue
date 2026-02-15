<template>
  <div class="min-h-screen flex flex-col items-center justify-center">
    <Search />
    <div class="max-w-5xl w-full space-y-4">
      <ContinueReading />
      <Explore class="mt-8" />
      <!-- <div class="divider font-serif"></div>
      <MassReadings /> -->
      <div class="divider font-serif">Books</div>
      <Books class="p-4" id="books-list"/>
    </div>
  </div>
</template>

<script setup>
import Explore from '~/components/Explore.vue';
import ContinueReading from '~/components/ContinueReading.vue';
import Books from '~/components/Books.vue';
import MassReadings from '~/components/MassReadings.vue';

// Set page title for homepage
useHead({
  title: 'Vulgatae - Biblia Sacra Vulgata'
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600&family=Crimson+Text:wght@400;600&display=swap');

.font-serif {
  font-family: 'EB Garamond', serif;
}
</style>