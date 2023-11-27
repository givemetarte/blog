<script setup>
// const route = useRoute()
// console.log(route.params.slug)

const { path } = useRoute()
const article = await useAsyncData('page-data', () => {
    return queryContent('/blog').where({ _path: path }).findOne()
})

const [prev, next] = await queryContent('/blog')
    .only(['title', '_path'])
    .sort({ createdAt: 1 })
    .findSurround(path)

// console.log(prev, next)
</script>

<template>
    <div class="relative max-w-4xl mx-auto justify-center mb-10 md:mb-10">
        <header class="flex flex-col item-start text-base justify-center text-center mt-1 mb-7 md:mb-16">
        <span class="text-base md:text-base text-gray-400 mb-2">{{ article.data._value.category }}</span>

        <h1 class="px-5 md:px-0 md:pt-10 mt-1 mb-5 text-2xl md:text-3xl text-center font-bold text-gray-700 keepall">
            {{ article.data._value.title }}
        </h1>
        <p class="text-base md:text-base text-gray-500 text-center">{{ article.data._value.datetime }} by {{ article.data._value.author }}</p>
        </header>

        <div class="hidden lg:block w-full">
            <div class="prose max-w-4xl keepall px-6 selection:bg-cherrylight">
                <ContentDoc :path="$route.params.slug ? `/blog/${$route.params.slug[0]}` : '/blog'" :document="article" />
            </div>
        </div>

        <div class="block lg:hidden">
            <div class="prose max-w-4xl keepall px-6 selection:bg-cherrylight">
                <ContentDoc :path="$route.params.slug ? `/blog/${$route.params.slug[0]}` : '/blog'" :document="article"  />
            </div>
        </div>

        <div class="space-x-2 flex-1 mt-7 mb-3 px-6">
            <div class="inline-flex text-gray-700 text-xs md:text-base">Tags:</div>
            <div v-for="(tag, idx) in article.data._value.tags" :key="idx" class="inline-flex text-center px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs mb-1">#{{ tag }}</div>
        </div>
    <Comments />
    <Prevnext :prev="prev" :next="next" />
    </div>
</template>

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

/* code::before {
  content: none !important;
}

code::after {
  content: none !important;
} */

.keepall{
    word-break: keep-all;
}
</style>

