import { defineStore } from "pinia";

export const useDetectionStore = defineStore("detectionStore", {
  state: () => ({
    data: null,
  }),
  actions: {
    setData(responseData) {
      this.data = responseData;
    },
  },
  persist: {
    storage: persistedState.localStorage,
  },
});
