<script setup>
import { useDomainStore } from "~/store/domainData";
import axios from "axios";
// const VueLoading = require("vue-loading-overlay");
// const { useLoading } = VueLoading;
const domainStore = useDomainStore();
// const $loading = useLoading({});
const error = ref(false);
const baseUrl = ref(null);
const mainUrl = ref(null);
const configg = useRuntimeConfig();
const route = useRoute();
const router = useRouter();
const by = route.params.by;
onMounted(async () => {
  baseUrl.value = configg.public.apiBase;
  mainUrl.value = configg.public.baseUrl;
  // const loader = $loading.show({});
  await checkDomainValidity();
  // loader.hide();
});

const checkDomainValidity = async () => {
  await axios.get(`${mainUrl.value}/sanctum/csrf-cookie`);
  const headers = {
    Accept: "application/json",
  };
  const response = await axios
    .post(
      baseUrl.value + "/check-domain",
      {
        domain: by,
      },
      { headers },
      {
        withCredentials: true,
        withXSRFToken: true,
      }

    )
    .catch((er) => {
      console.log(er);
      error.value = true;
      return er;
    });

  if (response && response.status === 200) {
    domainStore.data = response.data.domain;
    router.push({ path: "/choose-scan" });
  }
};
</script>

<template>
  <div v-if="error">
    <div class="min-h-screen">
      <div class="p-5">
        <div class="text-center">
          <p class="text-5xl mt-2 rounded-2xl bg-white p-4 text-red-500">
            Invalid Referral
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
