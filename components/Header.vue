<template>
    <header class="sticky top-0 z-50 w-full px-6 py-10 bg-white">
        <div class="max-w-4xl mx-auto flex items-center justify-between">
            <div class="max-w-fit ml-1.5 md:ml-0 hover:animate-wiggle hover:drop-shadow">
                <nuxt-link to="/">
                    <HeaderLogo />
                </nuxt-link>
            </div>
            <div>
                <ul class="flex space-x-2 text-base items-center">
                    <li>
                        <div class="py-1 px-2 rounded-lg">
                            <nuxt-link :to="{path: '/blog'}" replace class="text-gray-700 text-sm md:text-base hover:text-cherry poppins">Blog</nuxt-link>
                        </div>
                    </li>
                    <li>
                        <div class="py-1 px-2 rounded-lg">
                            <nuxt-link :to="{path: '/about'}" replace class="text-gray-700 text-sm md:text-base hover:text-cherry poppins">About</nuxt-link>
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
