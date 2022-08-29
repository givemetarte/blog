<template>
  <article class="relative max-w-3xl mx-auto justify-center mb-10 md:mb-10">
    <header class="flex flex-col item-start text-base justify-center text-center mt-1 mb-7">
      <span class="text-base md:text-base text-gray-400 mb-2">{{ article.category }}</span>
      <!--
      <p class="text-sm md:text-base text-gray-400 text-center mb-2">
        <span class="py-1 px-2 rounded-lg bg-gray-100 hover:drop-shadow">
          {{ article.category }}
        </span>
      </p>
      -->
      <h1 class="px-5 md:px-0 mt-1 mb-5 text-2xl md:text-3xl text-center font-bold text-gray-700 break-all">
        {{ article.title }}
      </h1>
      <p class="text-base md:text-base text-gray-500 text-center">{{article.datetime}} by {{article.author}}</p>
    </header>
    
    <nuxt-content :document="article" class="prose max-w-3xl custom-text px-6 selection:bg-cherrylight" />
    
    <div class="space-x-2 flex-1 mt-7 mb-3 px-6">
      <div class="inline-flex text-gray-700 text-xs md:text-base">Tags:</div>
      <div v-for="tag in article.tags" :key="{tag}" 
              class="inline-flex text-center px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs mb-1">#{{ tag }}
      </div>
    </div>
    <Comments />
    <Prevnext :prev="prev" :next="next" />
  </article>
</template>

<script>
  export default {
    async asyncData({ $content, params, error }) {
      try {
        const article = await $content('blog', params.slug).fetch();

        const [prev, next] = await $content('blog')
          .only(['title', 'slug'])
          .sortBy("datetime", "asc")
          .surround(params.slug)
          .fetch()
        
        return { article, prev, next }
      } catch(err) {
        error({
          statusCode: 404,
          message: 'Page could not be found',
        })
      }
    },
    methods: {
        formatDate(date){
            return new Date(date).toLocaleDateString('en', {year: 'numeric', month: 'long', day: 'numeric'})
        }
    },
    head() {
        return {
            title: this.article.title,
            htmlAttrs: {
            lang: 'ko'
            },
            meta: [
            { name: "author", content: "Haram Park" },
            { name: "description", property: "og:description", content: this.article.description, hid: "description"},
            { hid: 't-type', name: 'twitter:card', content: 'summary' },
            { hid: 'og-type', property: 'og:type', content: 'website' },
            { property: 'og:title', content: this.article.title },
            {
            hid: 'og:url',
            name: 'og:url',
            content: `https://www.blog.harampark.com/${this.$route.params.slug}`
            },
            ],
            link: [
              {
                hid: "canonical",
                rel: "canonical",
                href: `https://blog.harampark.com/blog/${this.$route.params.slug}`,
              },
            ],
        }
    },
    jsonld() {
      return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://blog.harampark.com/${this.$route.params.slug}`,
        },
        headline: this.article.title,
        description: this.article.description,
        image: 'https://raw.githubusercontent.com/givemetarte/blog/main/assets/images/thumbnail.png',
        author: {
          '@type': 'Person',
          name: 'Haram Park',
          email: 'mail@harampark.com',
          url: 'https://www.blog.harampark.com/about',
          nationality: {
            '@type': 'Country',
            name: 'South Korea'
          }
        },
        datePublished: this.article.datetime,
        inLanguage: 'ko',
        keywords: this.article.tags
      }
    },
}

</script>

<style scpoed>
.custom-text{
    word-break: keep-all;
}

.note {
  @apply bg-lavenderblush px-6 py-1 rounded-lg font-medium;
}

.img {
  @apply mt-6 mb-8 rounded-xl;
}

.line {
  @apply underline-offset-2 decoration-cherry decoration-wavy;
}

code::before {
  content: none !important;
}

code::after {
  content: none !important;
}

code {
  @apply px-1 py-1 bg-beigelight rounded-md;
}
</style>