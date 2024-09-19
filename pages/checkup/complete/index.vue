<script setup>
import vueFilePond from "vue-filepond";
import axios from "axios";

import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import "filepond-plugin-image-edit/dist/filepond-plugin-image-edit.css";
import "filepond-plugin-file-poster/dist/filepond-plugin-file-poster.min.css";
import "@pqina/pintura/pintura.css";
import FilePondPluginFilePoster from "filepond-plugin-file-poster";
import FilePondPluginImageEditor from "@pqina/filepond-plugin-image-editor";

import { PinturaEditor } from "@pqina/vue-pintura";
import {
  createDefaultImageReader,
  createDefaultImageWriter,
  locale_en_gb,
  setPlugins,
  plugin_crop,
  plugin_crop_locale_en_gb,
  plugin_filter,
  plugin_filter_defaults,
  plugin_filter_locale_en_gb,
  plugin_finetune,
  plugin_finetune_defaults,
  plugin_finetune_locale_en_gb,
  plugin_annotate,
  plugin_annotate_locale_en_gb,
  markup_editor_defaults,
  markup_editor_locale_en_gb,
  openEditor,
  processImage,
  createDefaultImageOrienter,
  legacyDataToImageState,
} from "@pqina/pintura";

import { useLoading } from "vue-loading-overlay";
import { useDetectionStore } from "~/store/detectionData";
import { useDomainStore } from "~/store/domainData";
const domainStore = useDomainStore();

const detectionStore = useDetectionStore();
setPlugins(plugin_crop, plugin_finetune, plugin_filter, plugin_annotate);

// Create FilePond component
const FilePond = vueFilePond(
  FilePondPluginImageEditor,
  FilePondPluginFilePoster
);

// handleLoad method

// data
let myEditor = {
  // map legacy data objects to new imageState objects
  legacyDataToImageState: legacyDataToImageState,

  // used to create the editor, receives editor configuration, should return an editor instance
  createEditor: openEditor,

  // Required, used for reading the image data
  imageReader: [createDefaultImageReader],

  // optionally. can leave out when not generating a preview thumbnail and/or output image
  imageWriter: [createDefaultImageWriter],

  // used to generate poster images, runs an editor in the background
  imageProcessor: processImage,

  // editor options
  editorOptions: {
    utils: ["crop", "finetune", "filter", "annotate"],
    imageOrienter: createDefaultImageOrienter(),
    ...plugin_finetune_defaults,
    ...plugin_filter_defaults,
    ...markup_editor_defaults,
    locale: {
      ...locale_en_gb,
      ...plugin_crop_locale_en_gb,
      ...plugin_finetune_locale_en_gb,
      ...plugin_filter_locale_en_gb,
      ...plugin_annotate_locale_en_gb,
      ...markup_editor_locale_en_gb,
    },
  },
};

const result = ref(null);

const $loading = useLoading({});
const { $toast } = useNuxtApp();
const router = useRouter();
const baseUrl = ref(null);
const frontView = ref(null);
const leftView = ref(null);
const rightView = ref(null);
const upperJaw = ref(null);
const lowerJaw = ref(null);
const results = ref(null);
const image = ref(null);
const video = ref(null);
const showModal = ref(false);

const isLoading = ref(false);
const configg = useRuntimeConfig();
onMounted(() => {
  if (!domainStore.data) {
    router.push({ path: "404" });
  }
  baseUrl.value = configg.public.apiBase + "/test";
});
const myFiles = ref([]);
const handleSubmit = async (e) => {
  isLoading.value = true;
  const loader = $loading.show({});
  const headers = {
    "Content-Type": "multipart/form-data",
  };
  const frontData = new FormData();
  frontData.append("domain", domainStore.data.id);
  frontData.append("type", "complete");

  const rightData = new FormData();
  rightData.append("domain", domainStore.data.id);
  rightData.append("type", "complete");
  const leftData = new FormData();
  leftData.append("domain", domainStore.data.id);
  leftData.append("type", "complete");
  const upperData = new FormData();
  upperData.append("domain", domainStore.data.id);
  upperData.append("type", "complete");
  const lowerData = new FormData();
  lowerData.append("domain", domainStore.data.id);
  lowerData.append("type", "complete");

  let promiseArray = [];

  if (frontView.value) {
    frontData.append("image", frontView.value);

    promiseArray.push(axios.post(baseUrl.value, frontData, { headers }));
  }

  if (rightView.value) {
    rightData.append("image", rightView.value);

    promiseArray.push(axios.post(baseUrl.value, rightData, { headers }));
  }

  if (leftView.value) {
    leftData.append("image", leftView.value);

    promiseArray.push(axios.post(baseUrl.value, leftData, { headers }));
  }

  if (upperJaw.value) {
    upperData.append("image", upperJaw.value);

    promiseArray.push(axios.post(baseUrl.value, upperData, { headers }));
  }

  if (lowerJaw.value) {
    lowerData.append("image", lowerJaw.value);

    promiseArray.push(axios.post(baseUrl.value, lowerData, { headers }));
  }

  if (promiseArray.length === 0) {
    $toast.error("You have to add at least one image");
    isLoading.value = false;
    loader.hide();
    return;
  }

  const res = await Promise.all(promiseArray)
    .then((responses) => {
      // Extract the data from the responses
      console.log(responses);
      return (results.value = responses.map((response) => response.data));
    })
    .catch((error) => {
      if (error.response && error.response.status === 422) {
        const errorData = error.response.data;
        console.log(errorData);
        if (Array.isArray(errorData.errors)) {
          errorData.errors.forEach((errorMessage) => {
            console.log("error", errorMessage);
            $toast.error(errorMessage);
          });
        } else {
          $toast.error(errorData.message);
        }
      } else {
        console.error("Error:", error);
      }
    })
    .finally(() => {
      isLoading.value = false;
      loader.hide();
    });
  console.log(res);
  if (res) {
    detectionStore.data = res;
    router.push({ path: "/checkup/complete/detection-result" });
  }
};

const handleProcess = (event) => {
  console.log("process", event);
  // this.result = URL.createObjectURL(event.detail.dest);
};

const handleFilePondInit = () => {
  // Initialization logic for FilePond
  console.log("FilePond initialized");
};
const handleInlineLoad = () => {
  // Initialization logic for FilePond
  console.log("FilePond loaded");
};
async function handleEditorProcess(forRef, imageState) {
  eval(forRef).value = await fetch(imageState.getMetadata().poster).then((r) =>
    r.blob()
  );
}

function openModal(myImage, myVideo) {
  image.value = myImage;
  video.value = myVideo;
  showModal.value = true;
}
function closeModal() {
  showModal.value = false;
  image.value = null;
  video.value = null;
}
</script>
<template>
  <div>
    <div class="py-4 flex align-middle">
      <button class=" rounded-full h-8 w-8 flex justify-center items-center z-20">
        <Icon @click="router.push({ path: '/' })" class="text-black" height="22px" width="22px"
          name="material-symbols:arrow-back-rounded" />
      </button>
      <p class="text-2xl text-black font-bold ml-4">Complete Checkup</p>
    </div>



    <div id="modelConfirm" :class="{ 'fixed': showModal, 'hidden': !showModal }"
      class="z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4 ">
      <div class="relative top-12 mx-auto shadow-xl rounded-md bg-white max-w-md">

        <div class="flex justify-end p-2">
          <button @click="closeModal"
            onclick="closeModal('modelConfirm', '/images/frontview_ph.jpeg', '/videos/instant-checkup.mp4')"
            type="button"
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"></path>
            </svg>
          </button>
        </div>

        <div class="bg-white rounded-md shadow-lg">
          <div class=" px-4 leading-none">
            <div class="flex-none text-center">
              <img :src="image" alt="pic" class="h-auto bg-gray-100 w-56 rounded-md  inline" />
            </div>

            <div class="flex-col text-gray-900 flex-1 pb-10">
              <!-- <hr class="hr-text" data-content="" /> -->

              <div class="grid grid-cols-1">
                <div class="text-md">
                  <div class="text-md my-2 text-center">
                    <span class="font-bold text-xl ">Scan Your Teeth</span><br />
                    <span class="">
                      You can scan your teeth by uploading images of your teeth
                      via Camera or Gallery
                    </span>
                  </div>
                  <div class="mt-5">
                    <span class="font-bold">How to click your photo?</span><br />
                    <ol class="list-decimal list-inside mt-2">
                      <li class="mb-2">
                        Picture should have only required teeth and surrounding
                        soft tissue. Crop the required area.
                      </li>
                      <li class="mb-2">The Picture should be clear and bright</li>
                      <li class="mb-2">Use the flash if necessary</li>
                      <li class="mb-2">
                        Avoid blurred, overexposed and dark pictures
                      </li>
                      <li class="mb-2">Upload it</li>
                      <li>Get Results</li>
                    </ol>
                  </div>
                  <div class="mt-4">
                    <span class="font-bold">Instructional Video</span><br />
                    <div class="mt-3">
                      <video :src="video" autoplay controls loop muted></video>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="min-h-screen grid grid-cols-1 md:grid-cols-1 gap-3">
      <div class="bg-white rounded-md shadow-lg">
        <div class="px-4 leading-none md:gap-5">

          <div class="flex-none text-center">
            <img src="/images/complete_checkup.png" alt="pic" class="h-auto bg-gray-100 w-56 rounded-md  inline" />
          </div>
          <div class="grid grid-cols-1"></div>

          <div class="flex-col text-gray-900 flex-1">

            <div class="grid grid-cols-1">
              <div class="text-md">
                <div class="text-md my-2 text-center">
                  <span class="font-bold text-xl ">Scan Your Teeth</span><br />
                  <span class="">
                    You can scan your teeth by uploading images of your teeth
                    via Camera or Gallery
                  </span>
                </div>
                <!-- <div class="mt-5">
                  <span class="font-bold">How to upload your photo</span><br />
                  <ol class="list-decimal list-inside mt-2">
                    <li class="mb-2">
                      Picture should have only required teeth and surrounding
                      soft tissue
                    </li>
                    <li class="mb-2">The Picture should be clear and bright</li>
                    <li class="mb-2">Use the flash if necessary</li>
                    <li class="mb-2">
                      Avoid blurred, overexposed and dark pictures
                    </li>
                    <li class="mb-2">Upload it</li>
                    <li>Get Results</li>
                  </ol>
                </div> -->
                <!-- <div class="mt-4">
                  <span class="font-bold">Instructional Video</span><br />
                  <div class="mt-3">
                    <video src="/videos/instant-checkup.mp4" autoplay controls loop muted></video>
                  </div>
                </div> -->
              </div>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-md shadow-lg p-2 md:px-10">
          <ClientOnly>
            <form @submit.prevent="handleSubmit" class="mt-8 space-y-3" id="upload-from" enctype="multipart/form-data">
              <div class="grid grid-cols-1 grid-rows-3 md:grid-cols-2 gap-4">
                <div class="relative">
                  <FilePond :imageEditor="myEditor" @preparefile="handleEditorProcess('frontView', $event)"
                    id="font-teeth-image" class="md:col-span-2" :required="false" name="Teeth Front view"
                    label-idle='<img src="/images/frontview_ph.jpeg" />Teeth Front View' />
                  <div @click="openModal('/images/frontview_ph.jpeg', '/videos/front.mp4')"
                    class="text-black absolute top-4 cursor-pointer right-10"><svg xmlns="http://www.w3.org/2000/svg" width="30"
                      height="30" viewBox="0 0 24 24">
                      <g fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M13.737 21.848a10.002 10.002 0 0 0 6.697-15.221a10 10 0 1 0-6.698 15.221z" />
                        <path stroke-linecap="square" d="M12 12v6m0-11V6" />
                      </g>
                    </svg></div>
                </div>
                <div class="relative">
                  <FilePond :imageEditor="myEditor" @:init="handleFilePondInit" id="right-teeth-image"
                    @preparefile="handleEditorProcess('rightView', $event)" class="" :required="false"
                    name="Teeth right view" label-idle='<img src="/images/rightview_ph.jpeg" />Teeth Right View' />
                  <div @click="openModal('/images/rightview_ph.jpeg', '/videos/right.mp4')"
                    class="text-black absolute top-4 cursor-pointer right-10"><svg xmlns="http://www.w3.org/2000/svg" width="30"
                      height="30" viewBox="0 0 24 24">
                      <g fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M13.737 21.848a10.002 10.002 0 0 0 6.697-15.221a10 10 0 1 0-6.698 15.221z" />
                        <path stroke-linecap="square" d="M12 12v6m0-11V6" />
                      </g>
                    </svg></div>
                </div>

                <div class="relative">
                  <FilePond :imageEditor="myEditor" @:init="handleFilePondInit" id="left-teeth-image" class=""
                    @preparefile="handleEditorProcess('leftView', $event)" :required="false" name="Teeth left view"
                    label-idle='<img src="/images/leftview_ph.jpeg" />Teeth Left View' />
                  <div @click="openModal('/images/leftview_ph.jpeg', '/videos/left.mp4')"
                    class="text-black absolute top-4 cursor-pointer right-10"><svg xmlns="http://www.w3.org/2000/svg" width="30"
                      height="30" viewBox="0 0 24 24">
                      <g fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M13.737 21.848a10.002 10.002 0 0 0 6.697-15.221a10 10 0 1 0-6.698 15.221z" />
                        <path stroke-linecap="square" d="M12 12v6m0-11V6" />
                      </g>
                    </svg></div>
                </div>

                <div class="relative">
                  <FilePond :imageEditor="myEditor" @:init="handleFilePondInit" id="upper-jaw-image" class=""
                    @preparefile="handleEditorProcess('upperJaw', $event)" :required="false" name="Teeth upper jaw"
                    label-idle='<img src="/images/upperview_ph.jpeg" />Teeth Upper Jaw' />
                  <div @click="openModal('/images/upperview_ph.jpeg', '/videos/upper.mp4')"
                    class="text-black absolute top-4 cursor-pointer right-10"><svg xmlns="http://www.w3.org/2000/svg" width="30"
                      height="30" viewBox="0 0 24 24">
                      <g fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M13.737 21.848a10.002 10.002 0 0 0 6.697-15.221a10 10 0 1 0-6.698 15.221z" />
                        <path stroke-linecap="square" d="M12 12v6m0-11V6" />
                      </g>
                    </svg></div>
                </div>

                <div class="relative">
                  <FilePond :imageEditor="myEditor" @:init="handleFilePondInit" id="lower-jaw-image" class=""
                    @preparefile="handleEditorProcess('lowerJaw', $event)" :required="false" name="Teeth lower jaw"
                    label-idle='<img src="/images/lowerview_ph.jpeg" />Teeth Lower Jaw' />
                  <div @click="openModal('/images/lowerview_ph.jpeg', '/videos/lower.mp4')"
                    class="text-black absolute top-4 cursor-pointer right-10"><svg xmlns="http://www.w3.org/2000/svg" width="30"
                      height="30" viewBox="0 0 24 24">
                      <g fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M13.737 21.848a10.002 10.002 0 0 0 6.697-15.221a10 10 0 1 0-6.698 15.221z" />
                        <path stroke-linecap="square" d="M12 12v6m0-11V6" />
                      </g>
                    </svg></div>
                </div>
              </div>
              <div class="text-center">
                <button :disabled="isLoading" type="submit"
                  class="mt-5 disabled:opacity-60 disabled:pointer-events-none inline-block w-full md:w-60 justify-center bg-[#b32121] text-gray-100 p-4 rounded-lg tracking-wide font-semibold focus:outline-none focus:shadow-outline hover:bg-[#8f1212] shadow-lg cursor-pointer transition ease-in duration-300 whitespace-nowrap">
                  <span v-if="!isLoading">Upload Photo</span>
                  <span v-else>Uploading...</span>
                </button>
              </div>
            </form>
          </ClientOnly>
        </div>
      </div>


      <p class="italic mt-4 text-sm text-black text-center">
        <span class="font-bold text-sm text-red-500">Disclaimer </span>:
        DentalFriend analyses the photos of your teeth and surrounding soft
        tissue using artificial intelligence and
        <br />
        machine learning. It is for awareness purpose only. It is not diagnostic
        and should be verified by your dentist.
      </p>
    </div>
  </div>
</template>

<style>
.filepond--root {
  min-height: 20rem !important;
}

.filepond--drop-label {
  align-items: center;
  height: 100%;
}

.filepond--drop-label label {
  height: 100%;
  width: 100%;
}

.filepond--drop-label label img {
  height: 90%;
  width: 100%;
  object-fit: contain;
  border-radius: 5px;
}

/* bright / dark mode */
.pintura-editor {
  --color-background: 255, 255, 255;
  --color-foreground: 10, 10, 10;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
}

@media (prefers-color-scheme: dark) {
  html {
    color: #fff;
    background: #111;
  }

  .pintura-editor {
    --color-background: 10, 10, 10;
    --color-foreground: 255, 255, 255;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
  }
}
</style>
