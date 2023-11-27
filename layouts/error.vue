<template>
    <div class="max-w-4xl mx-auto text-center font-normal text-base md:text-xl text-gray-600">
      <h1 v-if="error.statusCode === 404" class="align-middle py-48 md:py-60 text-4xl md:text-6xl font-medium text-gray-800 font-title">Page not found 🥲</h1>
      <h1 v-else>An error occurred</h1>
    </div>
</template>
  
<script>
export default {
    props: ['error'],
    layout: 'error' // you can set a custom layout for the error page
}
</script>
  
<style>
@import url(../assets/css/fonts.css);
</style>