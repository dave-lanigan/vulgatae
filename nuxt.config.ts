// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
    app: {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },
  modules: [
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    '@nuxt/content'
  ],
  vite: {
    plugins: [
      tailwindcss()
    ],
  },
  css: ["~/assets/app.css"],
  compatibilityDate: '2025-08-10',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      algoliaApplicationId: process.env.NUXT_PUBLIC_ALGOLIA_APPLICATION_ID || '',
      algoliaSearchApiKey: process.env.NUXT_PUBLIC_ALGOLIA_SEARCH_API_KEY || '',
      algoliaIndexName: process.env.NUXT_PUBLIC_ALGOLIA_INDEX || 'verses',
      dbPath: process.env.NUXT_DB_PATH,
    }
  },
  nitro: {
    devProxy: {
      '/.well-known': {
        target: 'https://example.com',
        changeOrigin: true
      }
    }
  }
});