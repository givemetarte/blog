<template>
    <header class="sticky top-0 z-50 w-full px-6 py-5 bg-white">
        <div class="max-w-5xl mx-auto flex items-center justify-between">
            <div class="max-w-fit ml-1.5 md:ml-0 hover:animate-wiggle hover:drop-shadow">
                <nuxt-link to="/">
                    <HeaderLogo  />
                </nuxt-link>
            </div>
            
            
            <div>
                <!-- desktop view -->
                <ul class="hidden md:flex space-x-2 text-base items-center">
                  <li>
                    <div class="py-1 px-2 rounded-lg">
                        <nuxt-link :to="{path: '/'}" replace class="text-gray-700 text-sm md:text-base hover:text-cherry poppins">Home</nuxt-link>
                    </div>
                  </li>
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

            <!-- mobile view -->
            <div class="md:hidden flex content-center">
                <button @click="drawer">
                    <MenuIcon class="w-6" />
                </button>
            </div>

            <transition enter-class="opacity-0" enter-active-class="ease-out transition-medium" enter-to-class="opacity-100" leave-class="opacity-100" leave-active-class="ease-out transition-medium" leave-to-class="opacity-0">
                <div @keydown.esc="isOpen = false" v-show="isOpen" class="z-10 fixed inset-0 transition-opacity">
                <div @click="isOpen = false" class="absolute inset-0 bg-black opacity-50" tabindex="0"></div>
                </div>
            </transition>

            <aside class="p-5 transform top-0 left-0 w-64 bg-white fixed h-full overflow-auto ease-in-out transition-all duration-300 z-30" :class="isOpen ? 'translate-x-0' : '-translate-x-full'">
            <div class="close">
              <button class="absolute top-0 right-0 mt-4 mr-4" @click=" isOpen = false">
                <CloseIcon class="w-5 pt-2"/>
              </button>
            </div>

            <ul class="divide-y pt-10 gray-text text-sm">
              <li class="flex justify-center"><nuxt-link :to="{path: '/'}" replace @click.native="closeMenu" class="my-4 inline-block">Home</nuxt-link></li>
              <li class="flex justify-center"><nuxt-link :to="{path: '/all-post'}" replace @click.native="closeMenu" class="my-4 inline-block">Blog</nuxt-link></li>
              <li class="flex justify-center flex-row items-center group py-1 px-2">
                <a href="https://harampark.com" @click="closeMenu" class="my-4 mr-1 inline-block">Portfolio</a>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3 group-hover:text-cherry">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                </div>
            </li>
            </ul>

            <div @click="isOpen = false" class="flex justify-center">
              <div>
                <div class="gray-text text-xs text-center mt-6">
                  ⓒ 2023-2024 Haram Park. <br> All Rights Reserved.
                </div>
              </div>
            </div>
          </aside>

        </div>
    </header>
</template>

<script>
    export default {
        name: 'Header',
        data() {
            return {
                isOpen: false
                };
            },
            methods: {
        drawer() {
            this.isOpen = !this.isOpen;
            },
        closeMenu() {
          this.isOpen = false;
          }
        },
        watch: {
    isOpen: {
      immediate: true,
      handler(isOpen) {
        if (process.client) {
          if (isOpen) document.body.style.setProperty("overflow", "hidden");
          else document.body.style.removeProperty("overflow");
        }
      }
    }
  },
  mounted() {
    document.addEventListener("keydown", e => {
      if (e.keyCode == 27 && this.isOpen) this.isOpen = false;
    });
  }

    };
</script>
