// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss'
  ],
  css: [
    '@/assets/css/tailwind.css',
    '@/assets/css/fonts.css'
  ],
  buildModules: [
    '@nuxtjs/tailwindcss',
  ],
  app: {
    head: {
      title: "Haram's Blog",
      htmlAttrs: {
        lang: 'ko',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: "🤍 Haram's Blog" },
        { name: 'format-detection', content: 'telephone=no' },
        // Twitter
        // Test on: https://cards-dev.twitter.com/validator
        {
          hid: 't-type',
          name: 'twitter:card',
          content: 'summary'
        },
        // Open Graph
        // Test on: https://developers.facebook.com/tools/debug/
        { hid: 'og:site_name', property: 'og:site_name', content: "Haram's Blog" },
        {
          hid: 'og:image',
          property: 'og:image',
          content: 'https://raw.githubusercontent.com/givemetarte/blog/main/assets/images/thumbnail.png'
        },
        {
          hid: 'og:image:secure_url',
          property: 'og:image:secure_url',
          content: 'https://raw.githubusercontent.com/givemetarte/blog/main/assets/images/thumbnail.png'
        },
        {
          hid: 'og:image:alt',
          property: 'og:image:alt',
          content: 'Logo Image'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon-cherry.ico' },
      ],
    },
  },
  content: {
    highlight: {
      theme: 'dracula-soft',
      preload: ['python', 'sql', 'json', 'javascript']
    },
  },
  devtools: { enabled: true }
})
