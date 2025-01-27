import axios from "axios";
import { ref, type App } from "vue";

const CDNVersion = ref<string | null>(null);
const loading = ref(true);

export function getCDNVersion() {
  return CDNVersion.value;
}

export function useCDNVersion() {
  return { version: CDNVersion, loading };
}

export default {
  install(app: App) {
    axios
      .get("https://ddragon.leagueoflegends.com/api/versions.json")
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          CDNVersion.value = response.data[0];
          console.log(`DataDragon CDN version set to ${CDNVersion.value}`);
        } else {
          console.error("Invalid response format for DataDragon CDN versions.");
        }
      })
      .catch((error) => {
        console.error(`Failed to fetch DataDragon CDN version: ${error}`);
      })
      .finally(() => {
        loading.value = false;
      });

    app.config.globalProperties.$cdnVersion = CDNVersion;
  },
};
