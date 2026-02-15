<template>
  <div :data-theme="theme">
    <DrawerNavigation>
      <NavBar />
      <NuxtPage />
      <Footer />
    </DrawerNavigation>
  </div>
</template>


<script setup>
const { theme } = useThemePreference()
</script>
