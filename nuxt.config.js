import getRoutes from "./utils/getRoutes";

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "Haram's Blog",
    htmlAttrs: {
      lang: 'ko',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Haram Blog' },
      { name: 'format-detection', content: 'telephone=no' },
      {
        hid: 't-type',
        name: 'twitter:card',
        content: 'summary'
      },

      { hid: 'og:site_name', property: 'og:site_name', content: "Haram's Blog" },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      {
        hid: 'og:url',
        property: 'og:url',
        content: 'https://www.blog.harampark.com'
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: "Haram's Blog"
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content:
          "👩🏻‍💻 박하람의 기술 블로그 | Haram's Tech Blog"
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: 'https://raw.githubusercontent.com/givemetarte/blog/main/assets/images/og-img.png'
      },
      {
        hid: 'og:image:secure_url',
        property: 'og:image:secure_url',
        content: 'https://raw.githubusercontent.com/givemetarte/blog/main/assets/images/og-img.png'
      },
      {
        hid: 'og:image:alt',
        property: 'og:image:alt',
        content: 'Haram image'
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon-cherry.ico' }],
  },

  loading: { color: '#c06c84' },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    // add tailwind.css
    '@/assets/css/tailwind.css',
    '~/assets/css/fonts.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/tailwindcss',
    '@nuxt-hero-icons/outline/nuxt',
    '@nuxt-hero-icons/solid/nuxt',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    "@nuxtjs/sitemap",
  ],

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
  sitemap: {
    hostname: 'https://www.blog.harampark.com',
    routes() {
      return getRoutes();
    },
  },
}
