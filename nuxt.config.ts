// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  runtimeConfig: {
    
    apiSecret: "123",
    
    public: {
      apiBase: process.env.API_BASE || "default_api_url",
      baseUrl: process.env.BASE_URL || "default_other_url"
    }
  },
  css: [
    '@/assets/css/main.css',
  ],
  pages:true,
  modules: [
    "@nuxtjs/tailwindcss",
    '@vueuse/nuxt',
    'nuxt-icon',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    'nuxt-headlessui',
  ],
  components: [
    {
      path: '~/components',
     extensions: ['.vue'],
    }
  ],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  build: {
    transpile: ['vue-sonner']
  },
  typescript:{
    shim:true
  },
  plugins: [

  ],
  
})