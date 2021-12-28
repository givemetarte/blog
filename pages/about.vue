<template>
    <div class="max-w-4xl mx-auto">
        <div class="px-5">
            <div class="pt-10 md:pt-12 text-lg md:text-xl text-gray-700 font-semibold mb-2 text-center md:text-left">About</div>
        </div>

        <!--if media query: -->
        <div class="hidden md:block">
            <div class="my-20 px-24 flex flex-row justify-between">
                <div class="w-52 h-52">
                    <img :src="require(`~/assets/images/profile.jpg`)" class="profile" />
                </div>
                <div class="w-2/3 py-8 pl-4">
                    <div class="text-gray-600 font-semibold text-lg md:mb-8">Haram Park | 박하람</div>
                    <div class="mt-5 text-gray-600 font-normal text-base keepall">대학원에서 지식공학을 공부하고 있습니다. 지식그래프, 데이터, 인공지능에 관심이 많습니다. 게시글과 관련된 이야기는 댓글로, 구체적인 코드는 <a href="https://github.com/givemetarte" class="highlight-xs">github</a>에서, 연락은 <a href="malito:mail@harampark.com" class="highlight-xs">email</a>로 해주세요.</div>
                </div>
            </div>
        </div>
        <!--else:-->
        <div class="block md:hidden">
            <div class="my-10 px-5 flex flex-col items-center">
                <div class="w-40 h-40 mb-10">
                    <img :src="require(`~/assets/images/profile.jpg`)" class="profile" />
                </div>
                <div class="w-4/5 md:w-2/3 text-gray-600 font-normal text-sm">
                    <div class="text-gray-600 font-medium text-base text-center keepall">Haram Park</div>
                    <div class="text-sm text-center mt-3">대학원에서 지식공학을 공부하고 있습니다. 지식그래프, 데이터, 인공지능에 관심이 많습니다. 게시글과 관련된 이야기는 댓글로, 구체적인 코드는 <a href="https://github.com/givemetarte" class="highlight-xs">github</a>에서, 연락은 <a href="malito:mail@harampark.com" class="highlight-xs">email</a>로 해주세요.</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    head: {
        title: 'About',
        htmlAttrs: {
        lang: 'ko'
        },
        meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '대학원에서 지식공학을 공부하고 있습니다. 지식그래프, 데이터, 인공지능에 관심이 많습니다. 게시글과 관련된 이야기는 댓글로, 구체적인 코드는 github에서, 연락은 email로 해주세요.' },
        { name: 'format-detection', content: 'telephone=no' }
        ]
    },
}


</script>

<style scope>
.profile {
    border-radius: 70%;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.keepall{
    word-break: keep-all;
}
</style>