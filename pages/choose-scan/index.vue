<script setup>
import { useDomainStore } from "~/store/domainData";
const router = useRouter();
const domainStore = useDomainStore();


function goToNext() {
    console.error(domainStore.data.domain);
    // router.push({ path: "/by/" + domainStore.data.domain });
    router.push({ path: "/" });
}

onMounted(() => {
})
</script>

<template>

    <div class="min-h-screen">


        <div class="p-3">
            <!-- <h3 class="text-3xl font-semibold text-center text-black">Dental Care Scans</h3> -->
            <div class="grid grid-cols-2 mt-4 gap-6">
                <div class="relative cursor-pointer" @click="goToNext">
                    <img src="/images/scan-3.png" alt="Discover Nuxt 3">
                    <p
                        class="absolute bottom-[20px] left-[10px] md:left-[25px] font-semibold text-white text-sm md:text-2xl">
                        AI Teeth Scan</p>
                </div>
                <!-- <div class="relative">
                    <img src="/images/scan-2.png" alt="Discover Nuxt 3">
                    <p
                        class="absolute bottom-[20px] left-[10px] md:left-[25px] font-semibold text-white text-sm md:text-2xl">
                        AI Toothbrush Scan</p>
                </div> -->
            </div>
        </div>

        <div class="blog p-3">
            <h5 class="text-black text-2xl font-semibold mb-4">Blogs</h5>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4  gap-3">

                <NuxtLink
                    to="https://www.theteledentists.com/post/embracing-teledentistry-10-compelling-reasons-to-consider-virtual-dental-care">
                    <div class="p-2 bg-gray-300">
                        <img src="/images/blog/blog-1.jpg" alt="">
                        <h4 class="text-black mt-1 font-semibold">Embracing Teledentistry</h4>
                    </div>
                </NuxtLink>
                <NuxtLink
                    to="https://www.theteledentists.com/post/why-you-should-book-an-online-dental-consultation-with-the-teledentists">
                    <div class="p-2 bg-gray-300">
                        <img src="/images/blog/blog-2.jpg" alt="">
                        <h4 class="text-black mt-1 font-semibold">Why You Should Book An Online Dental Consultation With
                            The
                            TeleDentists</h4>
                    </div>
                </NuxtLink>
                <NuxtLink
                    to="https://www.theteledentists.com/post/debunking-3-most-common-teledentistry-myths">
                    <div class="p-2 bg-gray-300">
                        <img src="/images/blog/blog-3.jpg" alt="">
                        <h4 class="text-black mt-1 font-semibold">Debunking 3 Most Common Teledentistry Myths</h4>
                    </div>
                </NuxtLink>
                <NuxtLink
                    to="https://www.theteledentists.com/post/get-your-dental-treatment-anywhere-anytime-with-teledentistry">
                    <div class="p-2 bg-gray-300">
                        <img src="/images/blog/blog-4.jpg" alt="">
                        <h4 class="text-black mt-1 font-semibold">Get Your Dental Treatment Anywhere, Anytime With
                            Teledentistry</h4>
                    </div>
                </NuxtLink>
                <NuxtLink
                    to="https://www.theteledentists.com/post/navigating-dental-emergencies-what-to-do-when-dental-pain-strikes">
                    <div class="p-2 bg-gray-300">
                        <img src="/images/blog/blog-5.jpg" alt="">
                        <h4 class="text-black mt-1 font-semibold">Navigating Dental Emergencies: What to Do When Dental
                            Pain
                            Strikes</h4>
                    </div>
                </NuxtLink>


            </div>
        </div>

    </div>
</template>
<style scoped></style>