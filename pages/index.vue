<template>
  <div class="max-w-4xl mx-auto">

    <!--블로그 소개-->
    <div class="pt-16">
      <div class="pt-14 md:pt-36 pb-6 md:pb-10 max-w-6xl mx-auto px-6">
          <h2 class="pb-6 poppins text-left md:text-left text-4xl md:text-6xl font-medium text-gray-800 font-title">
            Hi, I'm <span class="highlight-sm font-title">Haram</span> !
          </h2>
          <div class="font-normal text-sm md:text-base text-gray-600 keepall">
            파워 블로거👀가 되는 그날까지. <br> 주로 지식그래프와 관련된 글을 씁니다.
          </div>
      </div>
    </div>

    <!-- search -->
    <Search />

    <!--featured articles-->
    <div class="px-5">
        <div class="pt-6 md:pt-12 text-lg md:text-xl text-gray-700 font-bold">추천 글</div>
    </div>

    <div class="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-6 md:gap-y-0 pt-5">
      
      <div v-for="(ftarticle, idx) of featured" :key="`f-${idx}`" class="nthz hidden md:block hover:drop-shadow-lg">
        <nuxt-link :to='`/blog/${ftarticle.slug}`'>
          <div class="min-h-52 md:min-h-80">
            <div class="p-5 z-30">
              <p class="mb-1 md:mb-1 text-sm md:text-sm text-gray-500">{{ ftarticle.category }}</p>
              <h3 class="text-gray-700 text-lg font-bold break-all mb-2">{{ ftarticle.title }}</h3>
              <div class="flex flex-wrap gap-1">
                <div v-for="(tag, idx) in ftarticle.tags.slice(0, 3)" :key="`ft-${idx}`" 
                  class="inline-flex text-center px-2 py-1 opacity-70 rounded-full bg-gray-200 text-gray-500 text-xs">
                  #{{ tag }}
                </div>
                <span v-if="ftarticle.tags.length > 3" class="text-xs text-gray-500">
                  +{{ ftarticle.tags.length - 3 }} more
                </span>
              </div>
            </div>
          </div>
        </nuxt-link>
      </div>

      <div v-for="(featarticle, idx) of featuredone" :key="`o-${idx}`" class="block md:hidden hover:drop-shadow-lg">
        <nuxt-link :to='`/blog/${featarticle.slug}`'>
          <div class="back-purple rounded-lg h-60 py-5 px-6 relative">
            <div>
              <p class="text-xs text-gray-500">{{featarticle.category}}</p>
              <p class="text-base text-gray-700 font-bold pt-1 mb-2 keepall">{{featarticle.title}}</p>
              <!--
              <p class="text-gray-600 pt-1 ftmore mb-1">{{featarticle.description}}</p>
              -->
              <div v-for="(tag,idx) in featarticle.tags" :key="`ot-${idx}`" 
              class="inline-flex text-center px-2 py-1 opacity-70 rounded-full bg-gray-200 text-gray-500 text-xs mr-1 mb-1">#{{ tag }}
              </div>
            </div>
          </div>
        </nuxt-link>
      </div>
    </div>

    <!-- latest articles -->
    <div class="px-5">
        <div class="pt-10 md:pt-12 text-lg md:text-xl text-gray-700 font-bold mb-2">최근 글보기</div>
        <div class="text-gray-600 font-normal text-sm md:text-base">최근 업로드 된 글 모음입니다. 주제별로 글을 보고 싶다면 아래 태그를 선택해주세요.</div>
    </div>

    <div class="px-5 pt-10">
      <nuxt-link :to="{path: '/knowledge-graph'}" replace><span class="tag-btn">#<span class="text-gray-600 text-sm">지식그래프</span></span></nuxt-link>
      <nuxt-link :to="{path: '/data'}" replace><span class="tag-btn">#<span class="text-gray-600 text-sm">데이터</span></span></nuxt-link>
      <nuxt-link :to="{path: '/frontend-web'}" replace><span class="tag-btn">#<span class="text-gray-600 text-sm">웹개발</span></span></nuxt-link>
      <nuxt-link :to="{path: '/python-pandas'}" replace><span class="tag-btn">#<span class="text-gray-600 text-sm">Python</span></span></nuxt-link>
      <nuxt-link :to="{path: '/linux-docker'}" replace><span class="tag-btn">#<span class="text-gray-600 text-sm">Linux&Docker</span></span></nuxt-link>
      <nuxt-link :to="{path: '/mysql'}" replace><span class="tag-btn">#<span class="text-gray-600 text-sm">MySQL</span></span></nuxt-link>
      <nuxt-link :to="{path: '/web-server'}" replace><span class="tag-btn">#<span class="text-gray-600 text-sm">웹서버</span></span></nuxt-link>
      <nuxt-link :to="{path: '/llm'}" replace><span class="tag-btn">#<span class="text-gray-600 text-sm">NLP/LLM</span></span></nuxt-link>
      <nuxt-link :to="{path: '/etc'}" replace><span class="tag-btn">#<span class="text-gray-600 text-sm">기타</span></span></nuxt-link>
    </div>

    <div class="max-w-5xl grid grid-cols-1 md:grid-cols-1 mt-5 md:mt-6 mb-8 md:mb-12">
        <div v-for="(article, idx) of articles" :key="`a-${idx}`" class="px-5 md:px-6 group">
          <nuxt-link :to='`/blog/${article.slug}`'>
              <div class="flex justify-between border-t py-6 border-gray-200">
                <div class="w-full md:w-5/6">
                    <p class="mb-1 md:mb-1 text-sm md:text-sm font-medium text-cherry group-hover:text-gray-400">{{article.category}}</p>
                    <h3 class="custom-text mb-1 md:mb-2 text-lg md:text-xl font-bold text-gray-700 transition group-hover:text-cherry group-hover:duration-500">{{ article.title }}</h3>
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
      .sortBy("datetime", "desc")
      .limit(5)
      .fetch();
    const featured = await $content('blog', params.slug)
      .where({featured: 'Featured'})
      .sortBy("datetime", "desc")
      .limit(3)
      .fetch();
    const featuredone = await $content('blog', params.slug)
      .where({featured: 'Featured'})
      .sortBy("datetime", "desc")
      .limit(1)
      .fetch();
    return {
      articles,
      featured,
      featuredone
    }
  },
  methods: {
      formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(date).toLocaleDateString('en', options)
      }
  },
  head: {
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
            href: 'https://blog.harampark.com'
        },
    ],
  },
}
</script>

<style scoped>
.keepall{
    word-break: keep-all;
}
.nthz:nth-child(1){
  background-color: #C4C9FE;
  border-radius: 0.6rem;
}
.nthz:nth-child(2){
  background-color: #E5F6F1;
  border-radius: 0.6rem;
}
.nthz:nth-child(3){
  background-color: #F5EFD0;
  border-radius: 0.6rem;
}
.featbox {
    width: 250px;
    height: 160px; 
    border-radius: 5%;
    overflow: hidden;
}
.back-purple {
  background-color: #C4C9FE;
}

.tag-btn {
  @apply inline-block px-3 py-1.5 mr-1 md:mr-2 mb-2 rounded-full bg-gray-100 text-gray-400 text-sm transition hover:bg-lavenderblush hover:duration-100 hover:drop-shadow-sm
}

</style>