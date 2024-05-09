<template>
  <div class="bg-white">
    <Header />
    <Nuxt />
    <Footer />
  </div>
</template>

<script>
export default {
  name: 'Default',
  head: {
    script: [
      { 
        hid: 'adsense', 
        src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2995839243604748', 
        async: true, 
        crossorigin: 'anonymous' 
      }
    ]
  }
}

</script>

<style>
@import url(../assets/css/fonts.css);
@import url('katex/dist/katex.min.css');
/* body {
  background-color: #232741;
} */
</style>