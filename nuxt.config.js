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
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon-cherry.ico' }],
  },

  loading: { color: '#c06c84' },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    // add tailwind.css
    '@/assets/css/tailwind.css',
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
