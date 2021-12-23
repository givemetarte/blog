<template>
    <div class="max-w-4xl mx-auto">
        <div class="px-5">
            <div class="pt-10 md:pt-12 text-lg md:text-xl text-gray-700 font-semibold mb-2">About</div>
        </div>

        <!--if media query: -->
        <div class="hidden md:block">
            <div class="my-20 px-24 flex flex-row justify-between">
                <div class="w-52 h-52">
                    <img :src="require(`~/assets/images/profile.jpg`)" class="profile" />
                </div>
                <div class="w-2/3 pl-4">
                    <div class="text-gray-600 font-semibold text-lg">Haram Park | 박하람</div>
                    <div class="mt-3 text-gray-600 font-normal text-base">대학원에서 지식공학을 공부하고 있습니다.</div>
                </div>
            </div>
        </div>
        <!--else:-->
        <div class="block md:hidden">
            <div class="my-10 px-5 flex flex-col items-center">
                <div class="w-40 h-40 mb-10">
                    <img :src="require(`~/assets/images/profile.jpg`)" class="profile" />
                </div>
                <div class="w-1/2 md:w-2/3 text-gray-600 font-normal text-sm">
                    <div class="text-gray-600 font-medium text-base text-center">Haram Park</div>
                    <div class="text-sm text-center mt-3">haha</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

</script>

<style scope>
.profile {
    border-radius: 70%;
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>