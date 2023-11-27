<script setup>
import { ref, onMounted } from 'vue';

const scriptTag = ref(document.createElement('SCRIPT'));
scriptTag.setAttribute('src', 'https://utteranc.es/client.js');
scriptTag.setAttribute('repo', 'givemetarte/blog-comment');
scriptTag.setAttribute('issue-term', 'pathname');
scriptTag.setAttribute('label', 'Comment');
scriptTag.setAttribute('theme', 'github-light');
scriptTag.setAttribute('crossorigin', 'anonymous');
scriptTag.setAttribute('async', 'async');

onMounted(() => {
  // Append the script tag to the component's element
  document.getElementById('__YOUR_COMPONENT_ID__').appendChild(scriptTag);
});
</script>

<template>
</template>

<!-- <script>
export default {
  mounted() {
    const scriptTag = document.createElement('SCRIPT')
    scriptTag.setAttribute('src', 'https://utteranc.es/client.js')
    scriptTag.setAttribute('repo', 'givemetarte/blog-comment')
    scriptTag.setAttribute('issue-term', 'pathname')
    scriptTag.setAttribute('label', 'Comment')
    scriptTag.setAttribute('theme', 'github-light')
    scriptTag.setAttribute('crossorigin', 'anonymous')
    scriptTag.setAttribute('async', 'async')
    this.$el.append(scriptTag)
  },
}
</script> -->


<style>
.utterances {
  width: 100%;
  margin: 0 !important;
  max-width: 100%;
}
</style>