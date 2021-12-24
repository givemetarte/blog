<template>
  <div>
    <Header />
    <Nuxt />
    <Footer />
  </div>
</template>

<script>
export default {
  name: 'Default',
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Gochi+Hand&family=Inter:wght@300;400;500;600;700&family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap');

* {
  font-family: 'Inter', 'Roboto Mono', 'Noto Sans KR', sans-serif;
}

.font-title {
  font-family: 'Gochi Hand', cursive;
}

.font-inter {
  font-family: 'Inter', sans-serif;
}


</style>