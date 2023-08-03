import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("VueViewer", VueViewer);

  return {
    provide: {
        VueViewer,
    },
  };
});
