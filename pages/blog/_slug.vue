<template>
  <article class="article prose lg:prose-xl">
    
    <header class="article-header">
        <h1> {{article.title}} </h1>
        <p> {{article.description}} </p>

        <div class="details-cont">
            <span> {{formatDate(article.updatedAt)}} </span>
        </div>
    </header>

    <nuxt-content :document="article" />
  </article>
</template>

<script>
  export default {
    async asyncData({ $content, params }) {
      //here, we will fetch the article from the article/ folder based on the name provided in the 'params.slug`
      const article = await $content('articles', params.slug).fetch()

      return { article }
    },
    methods: {
        // format the data to be displayed in a readable format
        formatDate(date){
            return new Date(date).toLocaleDateString('en', {year: 'numeric', month: 'long', day: 'numeric'})
        }
    }
  }
</script>

<style scoped>
.article {
    @apply prose lg:prose-xl;
    @apply p-4 mt-6 lg:mt-8 m-auto lg:max-w-3xl;
}

.article-header{
    @apply mb-12 pb-8 lg:mb-16 border-gray-200 border-b-2;
}

.article-header h1{
    @apply mb-0;
}

.article-header .details-cont span{
    @apply text-opacity-50 text-sm;
}
</style>
