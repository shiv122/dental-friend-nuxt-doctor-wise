<script setup>
import { useDetectionStore } from "~/store/detectionData";
import { convertDetectionData } from "~/composables/convertDetectionData";
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/vue";
import { useDomainStore } from "~/store/domainData";

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

if (detectionStore.data === null) {
  router.push({ path: "/" });
}
const domainStore = useDomainStore();

const problems = ref(null);
onMounted(() => {
  if (!domainStore.data) {
    router.push({ path: "404" });
  }
  data.value = detectionStore.data;
  problems.value = convertDetectionData(data.value).convertedData;
});

function printPdf() {
  window.print();
  // let w = window.open()
  // router.push("/checkup/instant/detection-result-pdf");
}
</script>
<template>
  <div id="section-to-print">
    <ClientOnly>
      <div>
        <!-- {{ problems?.value.length }} -->
        <div class="min-h-screen p-3 md:p-10">
          <button
            class="fixed bottom-14 md:bottom-20 right-12 bg-red-500 rounded-full h-10 w-10 flex justify-center items-center z-20">
            <Icon @click="router.push({ path: '/checkup/instant' })" class="text-white" height="25px" width="25px"
              name="material-symbols:arrow-back-rounded" />
          </button>
          <div class="bg-white rounded-md overflow-hidden relative">
            <p class="text-xl text-center mt-4 font-bold text-[#b32121]">
              Teeth Scan Report
            </p>

            <!-- <a
              v-if="problems.value.length > 0"
              href="/checkup/instant/detection-result-pdf"
              class="absolute right-5 top-5"
            >
              <button
                class="bg-gray-500 text-white rounded-full h-10 w-10 flex items-center justify-center"
              >
                <Icon
                  name="pepicons-print:printer"
                  class="h-5 w-5 text-white"
                />
              </button>
            </a> -->

            <div class="md:flex md:pr-4 leading-none md:gap-5 mt-2">
              <div class="flex-none text-center w-full">
                <img v-if="problems.value.length > 0" @click="setViewImage(data?.image)" :src="data?.image" alt="pic"
                  class="h-auto bg-gray-100 w-auto inline rounded-xl max-h-80 mb-4" />
              </div>

              <!-- <div class="flex-col text-gray-900 flex-1 pb-10 px-5">
                <p class="pt-4 text-3xl font-bold">Checkup Results</p>
                <hr class="hr-text mt-5" data-content="" />
              </div> -->
            </div>
          </div>

          <div v-if="problems.value.length > 0" class="bg-white rounded-md overflow-hidden mt-5">
            <div class="leading-none">
              <div class="flex-col text-gray-900 flex-1 pb-4 px-0 md:px-5">
                <Disclosure v-slot="{ open = true }" defaultOpen>
                  <DisclosureButton
                    class="flex w-full justify-between rounded-t-lg bg-red-500 px-4 py-2 text-left text-sm font-medium text-white focus:outline-none mt-5">
                    <p class="text-xl">Teeth Condition</p>
                    <Icon name="material-symbols:keyboard-arrow-down" :class="open ? 'rotate-180 transform' : ''"
                      class="h-5 w-5 text-white" />
                  </DisclosureButton>
                  <transition enter-active-class="expand-enter-active" enter-from-class="expand-enter-from"
                    enter-to-class="expand-enter-to" leave-active-class="shrink-leave-active"
                    leave-from-class="shrink-leave-from" leave-to-class="shrink-leave-to">
                    <DisclosurePanel
                      class="px-4 pt-4 pb-2 text-sm text-gray-900 bg-gray-100 border-red-500 border rounded rounded-t-none border-t-0">
                      <div class="grid grid-cols-1">
                        <div class="text-md">
                          <div class="mt-5">
                            <div class="mb-2 block">
                              <div class="mb-10" v-for="(problem, ind) in problems.value" :key="ind">
                                <span class="font-bold text-xl mb-4 flex items-center gap-2">
                                  <!-- {{ problem }} -->
                                  <div :style="`--p-bg:${problem.color}`"
                                    class="text-dark-600 md:w-10 md:h-10 h-6 w-6 md:text-xl text-sm rounded-full bg-[var(--p-bg)] relative flex-none">
                                    <span class="text-white absolute inset-0 m-auto table">
                                      {{ problem.id }}</span>
                                  </div>
                                  {{ problem.name }}
                                </span>
                                <p class="mb-2">
                                  <span class="font-bold">Description</span> :
                                  <br />
                                  {{ problem.extra.description }}
                                </p>
                                <p class="mb-2 whitespace-pre-wrap">
                                  <span class="font-bold">Treatment Options</span>
                                  :
                                  <br />

                                  {{ problem.extra["treatment options"] }}
                                </p>

                                <div class="mb-4">
                                  <!-- <p class="pt-4 text-xl font-bold text-rose-500 mb-4">
                                Youtube Reference
                              </p> -->
                                  <Disclosure v-slot="{ open }">
                                    <DisclosureButton
                                      class="flex w-full justify-between rounded-t-lg bg-rose-100 px-4 py-2 text-left text-sm font-medium text-rose-900 hover:bg-rose-200 focus:outline-none mt-5">
                                      <span>Youtube Reference</span>
                                      <Icon name="material-symbols:keyboard-arrow-down" :class="open ? 'rotate-180 transform' : ''
                                        " class="h-5 w-5 text-rose-500" />
                                    </DisclosureButton>
                                    <transition enter-active-class="expand-enter-active"
                                      enter-from-class="expand-enter-from" enter-to-class="expand-enter-to"
                                      leave-active-class="shrink-leave-active" leave-from-class="shrink-leave-from"
                                      leave-to-class="shrink-leave-to">
                                      <DisclosurePanel class="px-4 pt-4 pb-2 text-sm text-gray-500 bg-rose-200">
                                        <div class="flex flex-wrap gap-3">
                                          <div class="rounded-lg overflow-hidden" v-for="vid in problem.extra.youtube">
                                            <iframe :src="vid"> </iframe>
                                          </div>
                                        </div>
                                      </DisclosurePanel>
                                    </transition>
                                  </Disclosure>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DisclosurePanel>
                  </transition>
                </Disclosure>
              </div>
            </div>
          </div>
          <div v-else class="bg-white rounded-md overflow-hidden mt-5">
            <div class="leading-none">
              <div class="flex-col text-gray-900 flex-1 pb-4 px-0 md:px-5">
                <Disclosure v-slot="{ open = true }" defaultOpen>
                  <DisclosureButton
                    class="flex w-full justify-between rounded-t-lg bg-red-500 px-4 py-2 text-left text-sm font-medium text-white focus:outline-none mt-5">
                    <p class="text-xl">Teeth Condition</p>
                    <Icon name="material-symbols:keyboard-arrow-down" :class="open ? 'rotate-180 transform' : ''"
                      class="h-5 w-5 text-white" />
                  </DisclosureButton>
                  <transition enter-active-class="expand-enter-active" enter-from-class="expand-enter-from"
                    enter-to-class="expand-enter-to" leave-active-class="shrink-leave-active"
                    leave-from-class="shrink-leave-from" leave-to-class="shrink-leave-to">
                    <DisclosurePanel
                      class="px-4 pt-4 pb-2 text-sm text-gray-900 bg-gray-100 border-red-500 border rounded rounded-t-none border-t-0">
                      <p>No Significant dental problem detected</p>
                    </DisclosurePanel>
                  </transition>
                </Disclosure>
              </div>
            </div>
          </div>
          <div class="bg-white">
            <div class="px-0 md:px-5 pb-4">

              <div v-show="problems.value.length > 0" class="w-full flex justify-center py-4">
                <a href="/checkup/instant/detection-result-pdf" class="bg-red-500 text-white text-md p-2 rounded-lg mt-4 text-center">Download
                  PDF</a>
              </div>
              <p class="text-center">Thank you for completing the AI Evaluation. Questions? Concerns? Connect with The TeleDentists NOW.
                <a class="underline text-blue-400" href="https://teledentists.vsee.me/u/AI">Click here</a> for your
                virtual consultation with a
                dentist.
              </p>
            </div>

          </div>
          <p class="italic mt-4 text-sm text-black text-center mb-0">
            Powered By DentalFriend
          </p>
          <p class="italic mt-2 text-sm text-black text-center">
            <span class="font-bold text-sm text-red-500">Disclaimer </span>:
            DentalFriend analyses the photos of your teeth and surrounding soft
            tissue using artificial intelligence and
            <br />
            machine learning. It is for awareness purpose only. It is not
            diagnostic and should be verified by your dentist.
          </p>
        </div>
      </div>

      <TransitionRoot appear :show="isOpen" as="template">
        <Dialog as="div" @close="closeModal" class="relative z-10">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
            leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
            <div class="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <div class="fixed inset-0 overflow-y-auto">
            <div class="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
                enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
                leave-to="opacity-0 scale-95">
                <DialogPanel
                  class="w-full h-full max-w-xxl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all relative">
                  <button class="absolute right-2 top-2 text-red-500" @click="closeModal">
                    <Icon name="bx:x-circle" class="w-6 h-6"></Icon>
                  </button>
                  <div class="mt-4">
                    <img class="w-full max-w-xxl rounded-xl" :src="viewImage" />
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
    </ClientOnly>
  </div>
</template>
<style scoped>
@keyframes expand-enter {
  from {
    opacity: 0;
    transform: scaleY(0);
    transform-origin: top;
  }

  to {
    opacity: 1;
    transform: scaleY(1);
    transform-origin: top;
  }
}

@keyframes shrink-leave {
  from {
    opacity: 1;
    transform: scaleY(1);
    transform-origin: top;
  }

  to {
    opacity: 0;
    transform: scaleY(0);
    transform-origin: top;
  }
}

.expand-enter-active {
  animation: expand-enter 0.5s ease-out;
}

.expand-enter-from {
  opacity: 0;
  transform: scaleY(0);
  transform-origin: top;
}

.expand-enter-to {
  opacity: 1;
  transform: scaleY(1);
  transform-origin: top;
}

.shrink-leave-active {
  animation: shrink-leave 0.5s ease-in;
}

.shrink-leave-from {
  opacity: 1;
  transform: scaleY(1);
  transform-origin: bottom;
}

.shrink-leave-to {
  opacity: 0;
  transform: scaleY(0);
  transform-origin: bottom;
}

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
