<template>
</template>

<script>
export default {
  mounted() {
    const scriptTag = document.createElement('SCRIPT')
    // uterrances
    scriptTag.setAttribute('src', 'https://utteranc.es/client.js')
    scriptTag.setAttribute('repo', 'givemetarte/blog-comment')
    scriptTag.setAttribute('issue-term', 'pathname')
    scriptTag.setAttribute('label', 'Comment')
    scriptTag.setAttribute('theme', 'github-light')
    scriptTag.setAttribute('crossorigin', 'anonymous')
    scriptTag.setAttribute('async', 'async')
    
    // giscus
    // scriptTag.setAttribute('src', 'https://giscus.app/client.js')
    // scriptTag.setAttribute('repo', 'givemetarte/blog-comment')
    // scriptTag.setAttribute('repo-id', 'R_kgDOGjgIew')
    // scriptTag.setAttribute('data-category', 'General')
    // scriptTag.setAttribute('data-category-id', 'DIC_kwDOGjgIe84CeJm1')
    // scriptTag.setAttribute('data-mapping', 'pathname')
    // scriptTag.setAttribute('data-strict', '0')
    // scriptTag.setAttribute('data-reactions-enabled', '1')
    // scriptTag.setAttribute('data-emit-metadata', '0')
    // scriptTag.setAttribute('data-input-position', 'bottom')
    // scriptTag.setAttribute('data-theme', 'preferred_color_scheme')
    // scriptTag.setAttribute('data-lang', 'ko')
    // scriptTag.setAttribute('crossorigin', 'anonymous')
    // scriptTag.setAttribute('async', 'async')
    this.$el.append(scriptTag)
  },
}
</script>


<style>
.utterances {
  width: 100%;
  margin: 0 !important;
  max-width: 100%;
}
</style>