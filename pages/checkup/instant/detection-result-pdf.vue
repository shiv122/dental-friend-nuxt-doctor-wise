<template>
  <div>
    <ClientOnly>
      <div id="section-to-print">
        <div class="border-2 border-red-600 p-[2px]">
          <div
            class="text-center flex justify-center items-center flex-col border-[6px] border-red-600 p-5"
          >
            <!-- {{ problems }} -->
            <div class="flex justify-center items-center flex-col">
              <img class="h-20" :src="logo" :alt="siteName" />
              <!-- <p class="mt-2 text-lg">{{ siteName }} Health Screening Report</p> -->
              <p>Instant Checkup</p>
            </div>

            <div class="mt-4">
              <h4 class="text-xl mb-2">View</h4>
              <img
                class="h-[15rem] rounded-lg mt-1"
                :src="data?.image"
                alt=""
              />
            </div>

            <div
              v-if="problems.value.length > 0"
              class="mt-4 w-full text-start"
            >
              <h4 class="text-xl text-red-700 font-bold">
                Teeth and Surrounding tissue conditions
              </h4>
              <div v-for="(problem, ind) in problems.value" :key="ind">
                <p class="">
                  {{ problem.name }}
                </p>

                <p>Description</p>
                {{ problem.extra.description }}

                <p class="mt-2">Treatment options</p>
                <p class="whitespace-pre-wrap">
                  {{ problem.extra["treatment options"] }}
                </p>

              </div>
              <p class="mt-4">
                Disclaimer <br />
                DentalFriend analyses the photos of your teeth and surrounding
                soft tissue using artificial intelligence and machine
                learning. It is for awareness purpose only. It is not
                diagnostic and should be verified by your dentist.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center mt-2 mb-5">
        <button
          @click="print"
          class="py-2 bg-green-500 text-white w-40 rounded-sm"
        >
          Print Report
        </button>
      </div>
    </ClientOnly>
  </div>
</template>
<script setup>
import { useDomainStore } from "~/store/domainData";
import { useDetectionStore } from "~/store/detectionData";
import { convertDetectionData } from "~/composables/convertDetectionData";

const domainStore = useDomainStore();
const detectionStore = useDetectionStore();
const config = ref(null);
const logo = ref(null);
const siteName = ref(null);
const configg = useRuntimeConfig();
const problems = ref(null);
const data = ref();

onMounted(() => {
  config.value = domainStore.data?.configs
    ? JSON.parse(domainStore.data?.configs)
    : null;

  logo.value = config.value?.logo
    ? configg.public.baseUrl + "/" + config.value.logo
    : "/images/logo.png";

  siteName.value = config.value?.site_name ?? "Dental Friend";
  data.value = detectionStore.data;
  problems.value = convertDetectionData(data.value).convertedData;

  nextTick(() => {
    window.print();
  });
});

const print = () => {
  window.print();
};
</script>

<style>
@media print {
  body {
    visibility: hidden;
  }
  #section-to-print {
    visibility: visible;
    position: absolute;
    inset: 0;
    margin: auto;
  }
}
</style>
