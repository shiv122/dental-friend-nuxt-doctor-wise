import { defineStore } from "pinia";

export const useDomainStore = defineStore("domainStore", {
    state: () => ({
        data: null,
    }),
    actions: {
        setData(responseData) {
            this.data = responseData;
        },

        async getData() {
            return this.data;
        }

    },
    persist: {
        storage: persistedState.localStorage,
    },
});
