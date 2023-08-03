<template>
  <div class="min-h-screen">
    <div class="p-5">
      <div class="text-center">
        <!-- <p class="text-5xl mt-2 rounded-2xl bg-white p-4">
            Dental Friend's AI powered Dental Checkup
          </p> -->
      </div>
      <div v-if="!loading" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
        <UiCardsCheckupCard
          text="Instant Checkup"
          image="/images/instant_checkup.png"
          link="/checkup/instant"
        />
        <UiCardsCheckupCard
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
const domainStore = useDomainStore();
const router = useRouter();
const loading = ref("true");
onMounted(() => {
  if (!domainStore.data) {
    router.push({ path: "404" });
  } else {
    loading.value = false;
  }
});
</script>