import { computed, type Ref } from "vue";
import type { Skin } from "../types/ddragon";
import useMediaQuery from "./useMediaQuery";

type SkinsContainer = Ref<HTMLDivElement | null, HTMLDivElement | null>;
type Skins = Ref<Skin[] | null, Skin[] | null>;

interface RandomizerArguments {
  skinsContainer: SkinsContainer;
  skins: Skins;
  selectedSkin: Ref<number, number>;
  running: Ref<boolean, boolean>;
  disabledSkins: Ref<number[], number[]>;
  isGrid: Ref<boolean, boolean>;
  stopAutoRotate: () => void;
  onRotationEnd: () => void;
}

export default function useRandomizer({
  onRotationEnd,
  selectedSkin,
  skins,
  isGrid,
  running,
  disabledSkins,
  skinsContainer,
  stopAutoRotate,
}: RandomizerArguments) {
  const randomize = () => {
    if (!skinsContainer.value || !skins.value) return;

    const isMobile = useMediaQuery();
    const rotate = computed(() => (isMobile.value ? "rotateX" : "rotateY"));

    const quantity = skins.value.length;
    const anglePerSkin = 360 / quantity;

    const enabledSkins = skins.value
      .map((_, index) => index)
      .filter((index) => {
        const isDisabled = disabledSkins.value.some(
          (num) => skins.value![index].num === num,
        );

        return !isDisabled;
      });

    const randomIndex = Math.floor(Math.random() * enabledSkins.length);
    selectedSkin.value = enabledSkins[randomIndex];

    const choosenSkinAngle = selectedSkin.value * anglePerSkin;
    const totalRotation = 1080 - choosenSkinAngle;

    stopAutoRotate();
    running.value = true;

    if (isGrid.value) {
      onRotationEnd();
    } else {
      skinsContainer.value.style.transform = `perspective(1000px) rotateX(-6deg) ${rotate.value}(${totalRotation}deg)`;
      const animation = skinsContainer.value.animate(
        [
          {
            transform: `perspective(1000px) rotateX(-6deg) ${rotate.value}(0deg)`,
          },
          {
            transform: `perspective(1000px) rotateX(-6deg) ${rotate.value}(${totalRotation}deg)`,
          },
        ],
        {
          duration: 2000,
          easing: "ease-out",
        },
      );

      animation.addEventListener("finish", () => {
        setTimeout(() => {
          onRotationEnd();
        }, 500);
      });
    }
  };

  return { randomize };
}
