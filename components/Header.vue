<template>
    <header class="sticky top-0 z-50 w-full p-10 bg-white">
        <div class="max-w-4xl mx-auto flex items-center justify-between">
            <div class="max-w-fit ml-1.5 md:ml-0 hover:animate-wiggle hover:drop-shadow">
                <nuxt-link to="/">
                    <HeaderLogo />
                </nuxt-link>
            </div>
            <div>
                <ul class="flex space-x-1 text-base items-center">
                    <li>
                        <div class="py-1 px-2 rounded-lg">
                            <nuxt-link to="blog" class="text-gray-700 text-sm hover:text-cherry">Blog</nuxt-link>
                        </div>
                    </li>
                    <li>
                        <div class="py-1 px-2 rounded-lg">
                            <nuxt-link to="about" class="text-gray-700 text-sm hover:text-cherry">About</nuxt-link>
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
