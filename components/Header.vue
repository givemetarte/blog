<template>
    <header class="sticky top-0 z-50 w-full px-6 py-5 bg-white">
        <div class="max-w-5xl mx-auto flex items-center justify-between">
            <div class="max-w-fit ml-1.5 md:ml-0 hover:animate-wiggle hover:drop-shadow">
                <nuxt-link to="/">
                    <HeaderLogo  />
                </nuxt-link>
            </div>
            <div>
                <ul class="flex space-x-2 text-base items-center">
                    <li>
                        <div class="py-1 px-2 rounded-lg">
                            <nuxt-link :to="{path: '/all-post'}" replace class="text-gray-700 text-sm md:text-base hover:text-cherry poppins">Blog</nuxt-link>
                        </div>
                    </li>
                    <!-- <li>
                        <div class="py-1 px-2 rounded-lg">
                            <nuxt-link :to="{path: '/about'}" replace class="text-gray-700 text-sm md:text-base hover:text-cherry poppins">About</nuxt-link>
                        </div>
                    </li> -->
                    <li class="flex flex-row items-center justify-center group py-1 px-2">
                        <div class="pr-1 text-gray-700 text-sm md:text-base group-hover:text-cherry poppins">
                            <a href="https://harampark.com" target="blank">Portfolio</a>
                        </div>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3 group-hover:text-cherry">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </header>
</template>

<script>
    export default {
        name: 'Header',
    };
</script>
