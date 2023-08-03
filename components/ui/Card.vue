<script setup>
import { defineProps } from "vue";

const props = defineProps({
  class: {
    type: String,
    required: false,
  },
});
</script>

<template>
  <div
    :class="`container mx-auto p-5 bg-white max-w-sm rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300 ${props.class}`"
  >
    <div class="">
      <slot />
    </div>
  </div>
</template>
