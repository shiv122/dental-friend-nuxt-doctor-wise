<template>
  <div class="grid grid-cols-1 space-y-2">
    <label class="text-sm font-bold text-gray-500 tracking-wide">Upload Image</label>
    <div class="flex items-center justify-center w-full">
      <label
        class="flex flex-col rounded-lg border-4 border-dashed w-full h-60 p-10 group text-center relative"
      >
        <div class="h-full w-full text-center flex flex-col items-center justify-center">
          <div class="flex flex-auto max-h-48 w-2/5 mx-auto -mt-10">
            <span class="absolute z-10 right-3 top-3" v-if="previewImage">
              <Icon
                @click.prevent="deleteImage"
                name="bxs:x-circle"
                height="25px"
                width="25px"
                class="cursor-pointer text-red-600"
              />
            </span>
            <img
              v-if="previewImage"
              :src="previewImage"
              class="has-mask absolute h-[calc(100%-20px)] w-[calc(100%-20px)] object-cover inset-0 m-auto rounded-lg"
              alt="Preview Image"
            />
          </div>
          <p class="pointer-none text-gray-500">
            <span class="text-sm">Drag and drop</span> files here <br />
            or
            <label for="uploadedFile" class="text-blue-600 hover:underline"
              >select a file</label
            >
            from your computer
          </p>
        </div>
        <input
          ref="fileInput"
          name="image"
          id="uploadedFile"
          type="file"
          class="hidden"
          @change="handleFileChange"
        />
        <input type="hidden" name="id" :value="id" />
      </label>
    </div>
  </div>
</template>

<script setup>
const id = 12;
const previewImage = ref(null);

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    previewImage.value = URL.createObjectURL(file);
  }
};

const deleteImage = () => {
  previewImage.value = null;
  // Clear the selected file from the file input element
  $refs.fileInput.value = "";
};
</script>
