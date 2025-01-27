import { AxiosError } from "axios";
import { getCDNVersion } from "../plugins/CDNVersionPlugin";
import type { Champion, SliderSkin } from "../types/ddragon";
import type { ApiPromise } from "../types/types";
import { cdnClient } from "./axios";

export function fetchChampions(): () => ApiPromise<Champion[]> {
  return async () => {
    try {
      const version = getCDNVersion();
      if (!version) throw new Error("CDN version not found.");

      const response = await cdnClient.get(
        `${version}/data/en_US/champion.json`,
      );
      console.log(response);
      const champions: Champion[] = Object.values(response.data.data).map(
        (champion: any) => ({
          id: champion.id,
          name: champion.name,
          title: champion.title,
          tags: champion.tags,
        }),
      );

      return { data: champions, error: null };
    } catch (e) {
      const error = e as AxiosError;
      console.error(
        `Error fetching champions with code ${error.code}:`,
        error.message,
      );

      return {
        data: null,
        error: {
          code: error.code || "500",
          message: error.message,
        },
      };
    }
  };
}

export function fetchSkins(champion: string): () => ApiPromise<SliderSkin[]> {
  return async () => {
    try {
      const version = getCDNVersion();
      if (!version) throw new Error("CDN version not found.");

      const response = await cdnClient.get(
        `${version}/data/en_US/champion/${champion}.json`,
      );

      const skins: SliderSkin[] = response.data.data[champion].skins.map(
        (skin: any) => ({
          id: skin.id,
          num: skin.num,
          name: skin.name,
          enabled: true,
        }),
      );

      return { data: skins, error: null };
    } catch (e) {
      const error = e as AxiosError;
      console.error(
        `Error fetching ${champion} skins with code ${error.code}:`,
        error.message,
      );

      return {
        data: null,
        error: {
          code: error.code || "500",
          message: error.message,
        },
      };
    }
  };
}
