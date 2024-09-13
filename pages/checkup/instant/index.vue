<template>
  <div class="">
    <!-- <button
      class="fixed bottom-14 md:bottom-20 right-12 bg-red-500 rounded-full h-10 w-10 flex justify-center items-center z-20">
      <Icon @click="router.push({ path: '/' })" class="text-white" height="25px" width="25px"
        name="material-symbols:arrow-back-rounded" />
    </button> -->

    <div class="py-4 flex align-middle">
      <button class=" rounded-full h-8 w-8 flex justify-center items-center z-20">
        <Icon @click="router.push({ path: '/choose-scan' })" class="text-black" height="22px" width="22px"
          name="material-symbols:arrow-back-rounded" />
      </button>
      <p class="text-2xl font-bold ml-4">Instant Checkup</p>
    </div>


    <div class="min-h-screen  grid grid-cols-1 md:grid-cols-2 gap-3">
      <div class="bg-white rounded-md shadow-lg">
        <div class=" px-4 leading-none">
          <div class="flex-none text-center">
            <img src="/images/instant_checkup.png" alt="pic" class="h-auto bg-gray-100 w-56 rounded-md  inline" />
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
                </div>
                <div class="mt-4">
                  <span class="font-bold">Instructional Video</span><br />
                  <div class="mt-3">
                    <video src="/videos/instant-checkup.mp4" autoplay controls loop muted></video>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-md shadow-lg p-5 md:p-10">
        <form @submit.prevent="handleSubmit" class="mt-8 space-y-3" id="upload-from" enctype="multipart/form-data">
          <div class="grid grid-cols-1 space-y-2">
            <label class="text-sm font-bold text-gray-500 tracking-wide">Upload Image</label>
            <file-pond :imageEditor="myEditor" :ref="pond" @preparefile="handleEditorProcess($event)"
              label-idle="Click photo or Select Photo" />
          </div>
          <!-- <img :src="previewImage" alt="" /> -->
          <div class="text-center">
            <button :disabled="isLoading || file === null" type="submit"
              class="mt-5 disabled:opacity-60 disabled:pointer-events-none inline-block w-full md:w-60 justify-center bg-[#b32121] text-gray-100 p-4 rounded-lg tracking-wide font-semibold focus:outline-none focus:shadow-outline hover:bg-[#8f1212] shadow-lg cursor-pointer transition ease-in duration-300 whitespace-nowrap">
              <span v-if="!isLoading">Upload Photo</span>
              <span v-else>Uploading...</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { useLoading } from "vue-loading-overlay";
import { useDetectionStore } from "~/store/detectionData";
import vueFilePond from "vue-filepond";
import FilePondPluginFilePoster from "filepond-plugin-file-poster";
import FilePondPluginImageEditor from "@pqina/filepond-plugin-image-editor";
import { useDomainStore } from "~/store/domainData";
// Import FilePond styles
import "filepond/dist/filepond.min.css";
import "filepond-plugin-file-poster/dist/filepond-plugin-file-poster.min.css";

// Import Pintura styles
import "@pqina/pintura/pintura.css";

// Import Pintura
import {
  // editor
  createDefaultImageReader,
  createDefaultImageWriter,
  locale_en_gb,

  // plugins
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

  // filepond
  openEditor,
  processImage,
  createDefaultImageOrienter,
  legacyDataToImageState,
  openDefaultEditor,
} from "@pqina/pintura";

setPlugins(plugin_crop, plugin_finetune, plugin_filter, plugin_annotate);
const domainStore = useDomainStore();

// Create FilePond component
const FilePond = vueFilePond(
  FilePondPluginImageEditor,
  FilePondPluginFilePoster
);

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
const detectionStore = useDetectionStore();

const previewImage = ref(null);
const file = ref(null);
const isLoading = ref(false);
const $loading = useLoading({});
const fullPage = ref(false);
const isModalOpen = ref(false);
const router = useRouter();
const { $toast } = useNuxtApp();
const baseUrl = ref(null);

const configg = useRuntimeConfig();
onMounted(() => {
  if (!domainStore.data) {
    router.push({ path: "404" });
  }
  console.log(configg);
  baseUrl.value = configg.public.apiBase;
});

const handleEditorProcess = async (imageState) => {
  file.value = await fetch(imageState.getMetadata().poster).then((r) =>
    r.blob()
  );
  previewImage.value = URL.createObjectURL(file.value);
};

const handleSubmit = async (e) => {
  if (file.value === null) {
    $toast.error("You have to add image");
    return;
  }
  console.log(file.value);
  isLoading.value = true;
  const loader = $loading.show({});
  const formData = new FormData();
  formData.append("image", file.value);
  formData.append("domain", domainStore.data.id);
  formData.append("type", "instant");

  const headers = {
    "Content-Type": "multipart/form-data",
  };

  const response = await axios
    .post(baseUrl.value + "/test", formData, { headers })
    .catch((error) => {
      console.log(error);
      if (error.response.status === 429) {
        $toast.error("Too many request", {
          description: "You can only get 10 reports in one minute",
        });
        return error;
      }
      if (error.response.status === 422) {
        const validationErrors = error.response.data.errors;

        for (const field in validationErrors) {
          if (validationErrors.hasOwnProperty(field)) {
            const fieldErrors = validationErrors[field];
            fieldErrors.forEach((error) => {
              $toast.error(error);
            });
          }
        }
      }

      return error;
    });
  isLoading.value = false;
  loader.hide();
  if (response && response.status === 200) {
    detectionStore.data = response.data;
    router.push({ path: "/checkup/instant/detection-result" });
  }
  console.log(response);
};
</script>

<style scoped>
.hr-text {
  line-height: 1em;
  position: relative;
  outline: 0;
  border: 0;
  color: black;
  text-align: center;
  height: 1.5em;
  opacity: 0.5;
}

.hr-text:before {
  content: "";
  background: linear-gradient(to right, #818078, #818078, transparent);
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  height: 1px;
}

.hr-text:after {
  content: attr(data-content);
  position: relative;
  display: inline-block;
  color: black;
  padding: 0 0.5em;
  line-height: 1.5em;
  color: #818078;
  background-color: #fcfcfa;
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
