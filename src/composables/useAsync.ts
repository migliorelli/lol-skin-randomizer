import { onMounted, ref } from "vue";
import type { ApiPromise } from "../types/types";

export default function useAsync<T>(fn: () => ApiPromise<T>) {
  const data = ref<T | null>(null);
  const error = ref<string | null>(null);
  const loading = ref<boolean>(false);

  const fetchData = async () => {
    loading.value = true;
    error.value = null;

    const response = await fn();
    if (response.error) {
      error.value = response.error.message;
    } else {
      data.value = response.data;
    }

    loading.value = false;
  };

  onMounted(() => fetchData());

  return {
    data,
    error,
    loading,
    refetch: fetchData,
  };
}
