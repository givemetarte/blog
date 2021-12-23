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
@import url('https://fonts.googleapis.com/css2?family=Gochi+Hand&family=Inter:wght@300;400;500&family=Merriweather:wght@900&family=Noto+Sans+KR:wght@300;400&display=swap');

* {
  font-family: 'Inter', 'Noto Sans KR', sans-serif;
}

.font-title {
  font-family: 'Gochi Hand', cursive;
}

.font-subtitle {
  font-family: 'Merriweather', serif;
}

.font-inter {
  font-family: 'Inter', sans-serif;
}


</style>