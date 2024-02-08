<template>
  <div class="min-h-screen">
    <div class="p-5">
      <div class="text-center">
        <!-- <p class="text-5xl mt-2 rounded-2xl bg-white p-4">
            Dental Friend's AI powered Dental Checkup
          </p> -->
      </div>
      <div v-if="!loading" class="grid grid-cols-1 md:grid-cols-1 gap-4 mt-10">
        <UiCardsCheckupCard
          text="Instant Checkup"
          image="/images/instant_checkup.png"
          link="/checkup/instant"
        />
        <div class="text-center">
          <p class="text-black">Brought to you by</p>
          <img
            class="h-20 w-30 inline justify-center"
            src="/images/sensodyne.jpg"
            alt="Discover Nuxt 3"
          />
        </div>
        <UiCardsCheckupCard
          v-if="domainStore.data.domain != 'Parodontax'"
          text="Complete Checkup"
          image="/images/complete_checkup.png"
          link="/checkup/complete"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDomainStore } from "~/store/domainData";
import axios from "axios";

const domainStore = useDomainStore();
const router = useRouter();
const loading = ref("true");
const configg = useRuntimeConfig();
const baseUrl = ref(null);
onMounted(() => {
  baseUrl.value = configg.public.apiBase;

  if (!domainStore.data) {
    router.push({ path: "404" });
  } else {
    checkDomainValidity();
    loading.value = false;
  }
});

const checkDomainValidity = async () => {
  const headers = {
    Accept: "application/json",
  };
  const response = await axios
    .post(
      baseUrl.value + "/check-domain",
      {
        domain: domainStore.data.domain,
      },
      { headers }
    )
    .catch((er) => {
      domainStore.data = null;
      console.log(er);
      error.value = true;
      return er;
    });

  if (response && response.status === 200) {
    domainStore.data = response.data.domain;
  }
};
</script>
