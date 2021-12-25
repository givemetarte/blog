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
      <h1 class="px-5 md:px-0 mt-1 mb-5 text-2xl md:text-3xl text-center font-bold text-gray-700 custom-text">{{ article.title }}</h1>
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
          .sortBy("datetime", "desc")
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
            description: this.article.description,
            htmlAttrs: {
            lang: 'ko'
            },
            meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            {
                hid: 't-type',
                name: 'twitter:card',
                content: 'summary'
            },
            {
            hid: 'og-type',
            property: 'og:type',
            content: 'website'
            },
            {
            hid: 'og:title',
            property: 'og:title',
            content: this.article.title
            },
            {
            hid: 'og:description',
            property: 'og:description',
            content: this.article.description
            },
            {
            hid: 'og:image',
            property: 'og:image',
            // content: this.article.img
            content: `https://raw.githubusercontent.com/givemetarte/blog/main/assets/images/thumbnail.png`
            },
            {
            hid: 'og:image:secure_url',
            property: 'og:image:secure_url',
            content: `https://raw.githubusercontent.com/givemetarte/blog/main/assets/images/thumbnail.png`
            },
            {
            hid: 'og:image:alt',
            property: 'og:image:alt',
            content: this.article.title
            },
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
                href: `https://blog.harampark.com/${this.$route.params.slug}`,
              },
            ],
        }
    },
}

</script>

<style scpoed>
.custom-text{
    word-break: keep-all;
}

.note {
  @apply bg-lavenderblush px-4 py-1 rounded-lg font-medium;
}
</style>
