<template>
  <div>
    <h2>FilePond</h2>
    <img :src="preview" alt="" />
    <file-pond
      :imageEditor="myEditor"
      :ref="pond"
      @preparefile="handleEditorProcess($event)"
    />
    <button
      class="inline-flex items-center px-10 py-2 bg-red-200 hover:bg-red-300 text-gray-800 text-sm font-medium rounded-md"
      @click="handleCropImage"
    >
      Show
    </button>
  </div>
</template>
<script setup>
// Import Vue FilePond
import vueFilePond from "vue-filepond";
import FilePondPluginFilePoster from "filepond-plugin-file-poster";
import FilePondPluginImageEditor from "@pqina/filepond-plugin-image-editor";

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

// Create FilePond component
const FilePond = vueFilePond(
  FilePondPluginImageEditor,
  FilePondPluginFilePoster
);
const croppedImageValue = ref(null);
const pond = ref(null);
const preview = ref(null);
const handleEditorProcess = (imageState) => {
  console.log(imageState.getMetadata().poster);
  preview.value = URL.createObjectURL(imageState.getMetadata().poster);
};

const handleCropImage = () => {
  console.log(pond.value?.getFiles());
};

// data
const myFiles = ref([]);
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
</script>

<style>
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
