// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
    app: {
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { rel: 'manifest', href: '/manifest.webmanifest' },
        { rel: 'apple-touch-icon', href: '/icons/icons/web/apple-touch-icon.png' }
      ]
    }
  },
  modules: [
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    '@nuxt/content',
    '@vite-pwa/nuxt',
  ],
  vite: {
    plugins: [
      tailwindcss()
    ],
  },
  pwa: {
    registerType: 'autoUpdate',
    devOptions: {
      enabled: true,
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      globIgnores: [
        '**/node_modules/**/*',
        'sw.js',
        'workbox-*.js',
        '**/_payload.json',
        '_nuxt/builds/**/*.json'
      ]
    },
    manifest: {
      name: 'Vulgatae.com',
      short_name: 'Vulgatae',
      description: 'A Latin focused Bible app for studying the Vulgate.',
      theme_color: '#b6862c',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      lang: 'en',
      icons: [
        {
          src: '/icons/icons/web/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/icons/icons/web/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
        }
      ]
    }
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