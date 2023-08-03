export function convertCompleteDetectionData(data) {
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
  
    return {
      convertedData: convertedData.value,
    };
  }
  