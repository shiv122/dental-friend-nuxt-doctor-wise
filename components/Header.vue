<script setup>
import { useDomainStore } from "~/store/domainData";
const domainStore = useDomainStore();

const config = ref(null);
const logo = ref(null);
const siteName = ref(null);
const configg = useRuntimeConfig();
const nuxtApp = useNuxtApp();

nuxtApp.hook("page:finish", () => {
  config.value = domainStore.data?.configs
    ? JSON.parse(domainStore.data?.configs)
    : null;

  logo.value = config.value?.logo
    ? configg.public.baseUrl + "/" + config.value.logo
    : "";
  //images/logo.png
  siteName.value = config.value?.site_name ?? "Dental Friend";
});

// onMounted(() => {
//   config.value = domainStore.data?.configs
//     ? JSON.parse(domainStore.data?.configs)
//     : null;

//   logo.value = config.value?.logo
//     ? configg.public.baseUrl + "/" + config.value.logo
//     : "/images/logo.png";

//   siteName.value = config.value?.site_name ?? "Dental Friend";
// });
</script>
<template>
  <nav
    class="bg-white w-full flex relative justify-center items-center mx-auto px-8 h-20"
  >
    <!-- logo -->
    <div class="inline-flex">
      <NuxtLink to="/">
        <div class="hidden md:flex items-center gap-5">
          <img class="h-10" :src="logo" :alt="siteName" />
          <p class="text-black">{{ siteName }}</p>
        </div>
        <div class="block md:hidden">
          <img class="h-20" :src="logo" :alt="siteName" />
        </div>
      </NuxtLink>
    </div>

    <!-- login -->
    <div class="flex-initial">
      <div class="flex justify-end items-center relative">
        <div class="flex mr-4 items-center"></div>
      </div>
    </div>
  </nav>
</template>
