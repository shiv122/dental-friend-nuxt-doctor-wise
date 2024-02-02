<template>
  <div>
    <ClientOnly>
      <div id="section-to-print">
        <div class="border-2 border-red-600 p-[2px]">
          <div
            class="text-center flex justify-center items-center flex-col border-[6px] border-red-600 p-5"
          >
            <div class="flex justify-center items-center flex-col">
              <img class="h-20" :src="logo" :alt="siteName" />
              <p class="mt-2 text-lg">{{ siteName }} Health Screening Report</p>
              <p>Complete Checkup</p>
            </div>
            <div
              class="border-t border-red-600 mt-10"
              v-for="(data, index) in formattedData"
              :key="index"
            >
              <!-- {{ data }} -->

              <div class="mt-4 flex justify-center items-center flex-col">
                <h4 class="text-xl mb-2">View</h4>
                <img
                  class="h-[15rem] max-w-[30rem] rounded-lg mt-1"
                  :src="data?.image"
                  alt=""
                />
              </div>

              <div v-if="data.length > 0" class="mt-4 w-full text-start">
                <h4 class="text-xl text-red-700 font-bold">
                  Teeth and Surrounding tissue conditions
                </h4>
                <div v-for="(problem, ind) in data" :key="ind">
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
              </div>
            </div>
            <p class="mt-4 text-start italic">
              Disclaimer <br />
              DentalFriend analyses the photos of your teeth and surrounding
              soft tissue using artificial intelligence and machine learning. It
              is for awareness purpose only. It is not diagnostic and should be
              verified by your dentist.
            </p>
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
import { useDetectionStore } from "~/store/detectionData";

import { convertCompleteDetectionData } from "~/composables/convertCompleteDetectionData";
import { useDomainStore } from "~/store/domainData";
const domainStore = useDomainStore();
const isOpen = ref(false);
const viewImage = ref(null);

const setViewImage = (image) => {
  viewImage.value = image;
  isOpen.value = true;
};
function closeModal() {
  isOpen.value = false;
}
function openModal() {
  isOpen.value = true;
}
const detectionStore = useDetectionStore();
const data = ref();
const router = useRouter();
const config = ref(null);
const logo = ref(null);
const siteName = ref(null);
const configg = useRuntimeConfig();

const formattedData = ref([]);
const validIds = ref([]);
if (detectionStore.data === null) {
  router.push({ path: "/" });
}

onMounted(() => {
  if (!domainStore.data) {
    router.push({ path: "404" });
  }
  config.value = domainStore.data?.configs
    ? JSON.parse(domainStore.data?.configs)
    : null;

  logo.value = config.value?.logo
    ? configg.public.baseUrl + "/" + config.value.logo
    : "/images/logo.png";

  siteName.value = config.value?.site_name ?? "Dental Friend";

  data.value = detectionStore.data;
  validIds.value = JSON.parse(domainStore.data.configs).allowed_conditions;
  data.value.map(function (d) {
    formattedData.value.push(formateData(d));
  });

  nextTick(() => {
    window.print();
  });
});

const formateData = (d) => {
  const data = convertCompleteDetectionData(d).convertedData;
  data.image = d.image;
  data["no_data"] = data.length <= 0;
  const allowed = validIds.value.map(Number);
  const filteredData = data.filter((item) => allowed.includes(item.id));

  filteredData.image = d.image;
  return filteredData;
};
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
