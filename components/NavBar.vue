<template>
    <div class="navbar bg-white shadow-sm">
        <div class="flex-none">
            <label for="bible-drawer" class="btn btn-square btn-ghost drawer-button">
                <Icon name="material-symbols:menu" size="24" />
            </label>
        </div>
        <div class="flex-1">
            <NuxtLink to="/" class="btn btn-ghost text-xl font-primary">vulgatae.com</NuxtLink>
        </div>
        <div class="flex-none">
            <NuxtLink to="/user" class="btn btn-ghost btn-square">
                <Icon name="lucide:user" size="22" />
            </NuxtLink>
        </div>

    </div>
</template>

<script setup>
</script>

<style scoped>
</style>