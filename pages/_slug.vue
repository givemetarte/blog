<template>
  <article class="relative max-w-3xl mx-auto justify-center mb-10 md:mb-10">
    
    <header class="text-base text-center justify-center mt-1 mb-5">
      <p class="text-sm md:text-base text-gray-400 text-center mb-2">
        <span class="py-1 px-2 rounded-lg bg-gray-100 hover:drop-shadow">
          {{ article.category }}
        </span>
      </p>
      <h1 class="px-5 md:px-0 mb-3 text-2xl md:text-4xl text-center font-semibold text-gray-700 custom-text">{{ article.title }}</h1>
      <span class="text-sm md:text-base text-gray-500 text-center">{{ formatDate(article.updatedAt) }}</span>
    </header>
    
    <nuxt-content :document="article" class="prose max-w-3xl custom-text px-6" />
    <Prevnext :prev="prev" :next="next" />
  </article>
</template>

<script>
  export default {
    async asyncData({ $content, params }) {
      const article = await $content('blog', params.slug).fetch()

      const [prev, next] = await $content('blog')
        .only(['title', 'slug'])
        .sortBy('datetime', 'asc')
        .surround(params.slug)
        .fetch()
      
      return { article, prev, next }
    },
    methods: {
        formatDate(date){
            return new Date(date).toLocaleDateString('en', {year: 'numeric', month: 'long', day: 'numeric'})
        }
    }
  }
</script>

<style scpoed>
.custom-text{
    word-break: keep-all;
}
</style>
