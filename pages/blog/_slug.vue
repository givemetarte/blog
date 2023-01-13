<template>

  <article class="relative max-w-4xl mx-auto justify-center mb-10 md:mb-10">
    <header class="flex flex-col item-start text-base justify-center text-center mt-1 mb-7 md:mb-16">
      <span class="text-base md:text-base text-gray-400 mb-2">{{ article.category }}</span>

      <h1 class="px-5 md:px-0 md:pt-10 mt-1 mb-5 text-2xl md:text-3xl text-center font-bold text-gray-700 keepall">
        {{ article.title }}
      </h1>
      <p class="text-base md:text-base text-gray-500 text-center">{{article.datetime}} by {{article.author}}</p>
    </header>

    <div class="hidden lg:block w-full">
      <div>
        <nuxt-content :document="article" class="prose max-w-4xl keepall px-6 selection:bg-cherrylight" />
      </div>
    </div>

    <!-- TOC -->
    <!-- <div class="hidden lg:block w-full">
      <div class="flex relative">
        <nuxt-content :document="article" class="prose max-w-3xl custom-text px-6 selection:bg-cherrylight" />
        <div>
          <ul class="flex flex-col w-1/5 fixed">
            <li class="font-medium mb-2 text-gray-700">Table of Contents</li>
            <li v-for="link of article.toc" :key="link.id" class="mb-2 text-gray-500 hover:text-gray-700">
              <a :href="`#${link.id}`">{{ link.text }}</a>
            </li>
          </ul>
        </div>
      </div>
    </div> -->

    <div class="block lg:hidden">
      <nuxt-content :document="article" class="prose max-w-4xl keepall px-6 selection:bg-cherrylight" />
    </div>
    
    <div class="space-x-2 flex-1 mt-7 mb-3 px-6">
      <div class="inline-flex text-gray-700 text-xs md:text-base">Tags:</div>
      <div v-for="(tag, idx) in article.tags" :key="idx" 
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
        },
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

.keepall{
    word-break: keep-all;
}
</style>