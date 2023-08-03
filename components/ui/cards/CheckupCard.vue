<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="checkup-card relative flex justify-center">
    <section
      class="absolute h-96 w-80 rotate-0 transform rounded-2xl bg-gray-400"
    ></section>

    <section
      class="h-96 w-80 rotate-0 transform space-y-6 rounded-2xl bg-gray-100 p-6 duration-300 hover:rotate-3 hover:bg-white"
    >
      <div class="flex justify-end">
        <div class="h-4 w-4 rounded-full bg-gray-900"></div>
      </div>

      <div class="flex flex-col h-full justify-between">
        <div class="text-center">
          <img class="h-[5rem] inline-block" :src="props.image" alt="" />
          <p
            class="text-center text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-violet-500 to-blue-500 mt-2"
          >
            {{ props.text }}
          </p>
        </div>

        <footer class="mb-10 flex justify-center">
          <NuxtLink :to="props.link">
            <button
              class="flex items-center rounded-lg bg-[#FF7308] px-4 py-2.5 text-xl font-bold text-white hover:bg-[#E56707]"
            >
              <a :href="props.link">Start</a>
              <svg
                class="h-9 w-9"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
          </NuxtLink>
        </footer>
      </div>
    </section>
  </div>
</template>
