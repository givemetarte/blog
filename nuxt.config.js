export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "Haram's Blog",
    htmlAttrs: {
      lang: 'ko',
    },
    scripts: {
        async: true,
        src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2995839243604748',
        crossorigin: 'anonymous'
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
      },
      // google adsense
      { name: 'google-adsense-account', content: 'ca-pub-2995839243604748' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon-cherry.ico' },
    ],
  },

  loading: { color: '#c06c84' },

  // 404 error page
  generate: {
    fallback: true,
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    // add tailwind.css
    '@/assets/css/tailwind.css',
    '~/assets/css/fonts.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/jsonld.js',
  ],

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

  sitemap: {
    hostname: 'https://blog.harampark.com',
    gzip: true,
    routes: [
      '/blog/blazegraph-named-graph/',
      '/blog/dask-read-csv/',
      '/blog/korea-admin-codes/',
      '/blog/nuxt-tailwind-blog/',
      '/blog/opensource-graphdb-review/',
      '/blog/pymysql-encoding-error/',
      '/blog/seo-schema-jsonld/',
      '/blog/rdflib-tutorial-dcat-1',
      '/blog/rdflib-tutorial-dcat-2',
      '/blog/python-sparql-endpoint',
      '/blog/resolve-cors-error',
      '/blog/vue-deploy-subdirec',
      '/blog/modal-window-vue',,
      '/blog/ubuntu-docker-compose-error',
      '/blog/pandas-explode',
      '/blog/python-pandas-none',
      '/blog/mysql-local-infile',
      '/blog/blazegraph-bulk-data-upload',
      '/blog/mac-nginx-install',
      '/blog/ubuntu-virtuoso-data-upload'
    ]
  },

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {
    markdown: {
      prism: {
        theme: 'prism-themes/themes/prism-one-light.css'
      }
    },
    liveEdit: false
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
