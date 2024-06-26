<template>
    <div class="max-w-4xl mx-auto">
      <div class="px-5">
          <div class="pt-10 md:pt-12 text-xl md:text-2xl text-gray-700 font-semibold mb-2">Python ({{ articles.length }})</div>
          <div class="text-gray-600 font-normal text-sm md:text-base">파이썬 주제를 담은 글 모음입니다. 다른 주제의 글을 보고싶다면 아래 태그를 클릭하세요.</div>
      </div>

      <div class="px-5 pt-10">
        <nuxt-link :to="{path: '/knowledge-graph'}" replace><span class="tag-btn">#<span class="text-gray-600 text-sm">지식그래프</span></span></nuxt-link>
        <nuxt-link :to="{path: '/data'}" replace><span class="tag-btn">#<span class="text-gray-600 text-sm">데이터</span></span></nuxt-link>
        <nuxt-link :to="{path: '/frontend-web'}" replace><span class="tag-btn">#<span class="text-gray-600 text-sm">웹개발</span></span></nuxt-link>
        <nuxt-link :to="{path: '/linux-docker'}" replace><span class="tag-btn">#<span class="text-gray-600 text-sm">Linux&Docker</span></span></nuxt-link>
        <nuxt-link :to="{path: '/mysql'}" replace><span class="tag-btn">#<span class="text-gray-600 text-sm">MySQL</span></span></nuxt-link>
        <nuxt-link :to="{path: '/web-server'}" replace><span class="tag-btn">#<span class="text-gray-600 text-sm">웹서버</span></span></nuxt-link>
        <nuxt-link :to="{path: '/llm'}" replace><span class="tag-btn">#<span class="text-gray-600 text-sm">NLP/LLM</span></span></nuxt-link>
        <nuxt-link :to="{path: '/etc'}" replace><span class="tag-btn">#<span class="text-gray-600 text-sm">기타</span></span></nuxt-link>
      </div>
  
      <div class="max-w-4xl grid grid-cols-1 md:grid-cols-1 mt-11 md:mt-12 mb-8 md:mb-12">
          <div class="px-5 md:px-6 group" v-for="(article, idx) of articles" :key="idx">
            <nuxt-link :to='`/blog/${article.slug}`'>
                <div class="article-inner flex justify-between border-t py-6 border-gray-200">
                  <div class="w-full md:w-5/6">
                      <p class="mb-1 md:mb-1 text-sm md:text-sm font-medium text-cherry group-hover:text-gray-400">{{article.category}}</p>
                      <h3 class="mb-1 md:mb-1.5 text-lg md:text-xl font-semibold text-gray-700 transition group-hover:text-cherry group-hover:duration-500">{{ article.title }}</h3>
                      <p class="mb-1 md:mb-1.5 text-sm md:text-base text-gray-500 custom-text">{{article.description}}</p>
                      <p class="text-sm md:text-sm text-gray-400">{{ article.datetime }}</p>
                  </div>
                  <div class="hidden md:block pl-4 pr-6">
                    <div class="h-full py-10">
                      <outline-link-icon class="w-6 h-6 text-gray-400 group-hover:text-gray-700 transition duration-200" />
                    </div>            
                  </div>
                </div>
            </nuxt-link>
          </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    async asyncData({ $content, params }) {
      const articles = await $content('blog', params.slug)
        .where({category: 'Python'})
        .sortBy("datetime", "desc")
        .fetch();
      return {
        articles
      }
    },
    head: {
      title: 'Python | Articles',
      htmlAttrs: {
        lang: 'ko'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: "Haram's Blog" },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        {
            hid: "canonical",
            rel: "canonical",
            href: 'https://blog.harampark.com/python-pandas'
        },
    ],
    },
  }
  </script>
  
  <style scoped>
  .custom-text{
      word-break: keep-all;
  }
  
  .tag-btn {
    @apply inline-block px-3 py-1.5 mr-1 md:mr-2 mb-2 rounded-full bg-gray-100 text-gray-400 text-sm transition hover:bg-lavenderblush hover:duration-100 hover:drop-shadow-sm
  }
  </style>