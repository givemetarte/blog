<template>
    <footer class="w-full pt-11 pb-11 md:pt-11 md:pb-11 px-2 md:px-5 border-t md:border-t border-gray-200">
        <div class="max-w-4xl mx-auto px-5">
            <div class="block md:flex relative">

                <div class="justify-around md:justify-start px-8 md:px-0 items-start flex">
                    <span class="text-xs text-gray-700">
                        <nuxt-link to="/" class="hover:text-cherry">하람 블로그</nuxt-link> &nbsp; | 
                        <a href="https://github.com/givemetarte" target="blank" class=""><GithubLogo /></a>
                    </span>
                </div>

                <ul class="flex justify-center md:absolute md:bottom-0 md:right-0 md:block mt-10 md:mt-0">
                    <li class="text-xs md:text-xs text-gray-700">
                        © 2021 Haram Park 🤍 Big thanks to <a href="https://www.blog.penielcho.com/" target="blank" class="hover:text-cherry">Peniel</a>
                    </li>
                </ul>

            </div>
        </div>

    </footer>
</template>

<script>
    export default {
        name: 'Footer',
    }
</script>

<style scoped>
</style>