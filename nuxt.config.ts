// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  modules: [
    '@nuxt/icon',
    '@nuxtjs/color-mode'
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  css: ["~/assets/app.css"],
  compatibilityDate: '2025-08-10',
  devtools: { enabled: true },

  // Public runtime config for Algolia (client-side only usage)
  runtimeConfig: {
    public: {
      algoliaApplicationId: process.env.NUXT_PUBLIC_ALGOLIA_APPLICATION_ID || '',
      algoliaSearchApiKey: process.env.NUXT_PUBLIC_ALGOLIA_SEARCH_API_KEY || '',
      algoliaIndexName: process.env.NUXT_PUBLIC_ALGOLIA_INDEX || 'verses'
    }
  },

  // Ignore DevTools warnings in development
  nitro: {
    devProxy: {
      '/.well-known': {
        target: 'https://example.com',
        changeOrigin: true
      }
    }
  }
});