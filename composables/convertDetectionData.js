import { useDomainStore } from "~/store/domainData";

export function convertDetectionData(data) {
  const convertedData = ref([]);
  const domainStore = useDomainStore();
  const allowed = JSON.parse(domainStore.data.configs).allowed_conditions;
  const convert = () => {
    convertedData.value = data?.problems.map((problem, index) => ({
      name: problem,
      color: data.colors[index],
      id: data.ids[index],
      extra: data.extras[index],
    }));
  };

  convert();

  const validIds = allowed.map(Number);
  convertedData.value = convertedData.value.filter((item) =>
    validIds.includes(item.id)
  );

  return {
    convertedData: computed(() => convertedData.value),
  };
}
