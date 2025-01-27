import { computed, ref, type Ref } from "vue";
import useMediaQuery from "./useMediaQuery";

type SkinsContainer = Ref<HTMLDivElement | null, HTMLDivElement | null>;

export default function useAutoRotate(skinsContainer: SkinsContainer) {
  const autoRotate = ref<Animation | null>(null);
  const isMobile = useMediaQuery();
  const rotate = computed(() => (isMobile.value ? "rotateX" : "rotateY"));

  const startAutoRotate = () => {
    if (!skinsContainer.value) return;

    skinsContainer.value.style.transform = "none";
    autoRotate.value = skinsContainer.value.animate(
      [
        {
          transform: `perspective(1000px) rotateX(-6deg) ${rotate.value}(0deg)`,
        },
        {
          transform: `perspective(1000px) rotateX(-6deg) ${rotate.value}(360deg)`,
        },
      ],
      {
        duration: 20000,
        iterations: Infinity,
        easing: "linear",
      },
    );
  };

  const stopAutoRotate = () => {
    if (!autoRotate.value || !skinsContainer.value) return;

    autoRotate.value.cancel();
    autoRotate.value = null;
  };

  const onEnter = () => {
    if (!autoRotate.value) return;

    autoRotate.value.playbackRate = 0.2;
  };

  const onLeave = () => {
    if (!autoRotate.value) return;

    autoRotate.value.playbackRate = 1;
  };

  return { autoRotate, startAutoRotate, stopAutoRotate, onEnter, onLeave };
}
