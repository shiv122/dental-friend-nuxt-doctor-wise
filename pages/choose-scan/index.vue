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
            <h3 class="text-3xl font-semibold text-center">Dental Care Scans</h3>
            <div class="grid grid-cols-2 mt-10 gap-6">
                <div class="relative cursor-pointer" @click="goToNext">
                    <img src="/images/scan-1.png" alt="Discover Nuxt 3">
                    <p
                        class="absolute bottom-[20px] left-[10px] md:left-[25px] font-semibold text-white text-sm md:text-2xl">
                        AI Teeth Scan</p>
                </div>
                <div class="relative">
                    <img src="/images/scan-2.png" alt="Discover Nuxt 3">
                    <p
                        class="absolute bottom-[20px] left-[10px] md:left-[25px] font-semibold text-white text-sm md:text-2xl">
                        AI Toothbrush Scan</p>
                </div>
            </div>
        </div>




        <!-- <h2>Choose Scan</h2>

        <button @click="goToNext"></button>

        <a href="/">
            AI Teeth Scan
        </a> -->
    </div>
</template>
<style scoped></style>