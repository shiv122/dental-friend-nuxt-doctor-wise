export function convertDetectionData(data) {
  const convertedData = ref([]);

  const convert = () => {
    convertedData.value = data?.problems.map((problem, index) => ({
      name: problem,
      color: data.colors[index],
      id: data.ids[index],
      extra: data.extras[index],
    }));
  };

  convert();

  const validIds = [11, 19, 8, 5, 16, 12, 4, 10, 17, 15];
  convertedData.value = convertedData.value.filter((item) =>
    validIds.includes(item.id)
  );

  return {
    convertedData: computed(() => convertedData.value),
  };
}
