import { ref, watchEffect } from "vue";

export default function useMediaQuery(query: string = "(max-width: 1024px)") {
  const matches = ref(false);

  watchEffect((onCleanup) => {
    const media = window.matchMedia(query);

    if (media.matches !== matches.value) {
      matches.value = media.matches;
    }

    const onChange = () => {
      matches.value = media.matches;
    };

    media.addEventListener("change", onChange);

    onCleanup(() => {
      media.removeEventListener("change", onChange);
    });
  });

  return matches;
}
