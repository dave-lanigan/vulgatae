<template>
  <div class="min-h-screen flex flex-col items-center justify-center">
    <Search />
    <div class="max-w-5xl w-full">
      <Explore />
      <div class="divider font-serif"></div>
      <MassReadings />
      <div class="divider font-serif"></div>
      <Books class="p-4" />
    </div>
  </div>
</template>

<script setup>
import Explore from '~/components/Explore.vue';
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