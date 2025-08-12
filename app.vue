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
const theme = useState('theme');
theme.value = "vulgatae-light";
</script>
