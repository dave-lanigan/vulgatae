<template>
    <div class="navbar bg-base-100 shadow-sm">
        <div class="flex-none">
            <label for="bible-drawer" class="btn btn-square btn-ghost drawer-button">
                <Icon name="material-symbols:menu" size="24" />
            </label>
        </div>
        <div class="flex-1">
            <NuxtLink to="/" class="btn btn-ghost text-xl font-serif">vulgatae.com</NuxtLink>
        </div>
        <div class="flex-none pr-4" @click="$colorMode.preference = $colorMode.preference === 'vulgatae-light' ? 'vulgatae-dark' : 'vulgatae-light'">
            <label class="swap swap-rotate">
                <input type="checkbox" class="theme-controller" value="synthwave" />
                <Icon name="material-symbols:light-mode" class="swap-off h-10 w-10" size="24" />
                <Icon name="material-symbols:dark-mode" class="swap-on h-10 w-10" size="24"/>
            </label>
        </div>
    </div>
</template>

<script setup>
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600&family=Crimson+Text:wght@400;600&display=swap');

.font-serif {
  font-family: 'EB Garamond', serif;
}
</style>