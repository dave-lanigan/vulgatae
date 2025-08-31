<template>
  <div class="">

    <!-- Navigation -->
    <div class="pt-4 pb-4 justify-between bg-base-100 shadow-md overflow-x-hidden">
    
      <div class="mx-auto flex items-center relative sm:static justify-between w-full max-w-screen-lg px-4">
        <!-- Back Arrow: always left -->
        <NuxtLink :to="`/`" class="btn btn-ghost text-xs sm:text-sm md:text-base flex-shrink-0">
          <Icon name="material-symbols:arrow-back" size="20" />
          <span class="hidden sm:inline">Back</span>
        </NuxtLink>

        <!-- Medium and Large Screen Title/Info -->
        <!-- <h1 class="book-title font-bold text-xl text-center break-words hidden sm:block">{{ currentBook?.title }} - {{ currentBook?.titleLatin }}</h1>
        <div class="book-ch-vs text-xs opacity-70 text-right break-words hidden sm:block">
          {{ currentBook?.numberOfBooks }} chapters • {{ currentBook?.numberOfVerses }} verses
        </div> -->

        <!-- Small Screen Component: centered absolutely -->
        <!-- <div class="flex flex-col items-center sm:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-full w-auto px-4 pointer-events-none">
          <div class="pointer-events-auto w-full">
            <h1 class="font-bold text-xl text-center break-words">{{ currentBook?.titleLatin }}</h1>
            <div class="text-xs opacity-70 text-center break-words">
              {{ currentBook?.numberOfBooks }} chapters • {{ currentBook?.numberOfVerses }} verses
            </div>
          </div>
        </div> -->
      </div>
    
    </div>

    <!-- Verses Component -->
    <div class="flex flex-col items-center justify-center">
      <ExploreVerses />
    </div>
  </div>
</template>

<script setup>
const route = useRoute()


</script>
