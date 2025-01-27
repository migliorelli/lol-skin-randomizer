<script setup lang="ts">
import { computed } from "@vue/reactivity";
import {
  Dices,
  GalleryHorizontal,
  LayoutGrid,
  RotateCcw,
  X,
} from "lucide-vue-next";
import { ref, useTemplateRef, watch } from "vue";
import { useRoute } from "vue-router";
import SkinCard from "../components/cards/SkinCard.vue";
import Button from "../components/ui/Button.vue";
import InfoTooltip from "../components/ui/InfoTooltip.vue";
import Input from "../components/ui/Input.vue";
import useAsync from "../composables/useAsync";
import useAutoRotate from "../composables/useAutoRotate";
import useMediaQuery from "../composables/useMediaQuery";
import usePersistentRef from "../composables/usePersistentRef";
import useRandomizer from "../composables/useRandomizer";
import { fetchSkins } from "../services/ddragon";
import type { Skin } from "../types/ddragon";
import { calculateApothem } from "../utils";

const {
  params: { id: champion },
} = useRoute();

const {
  data: skins,
  error,
  loading,
} = useAsync<Skin[]>(fetchSkins(champion as string));

const disabledSkins = usePersistentRef<number[]>(`${champion}_disabled`, []);
const skinsWrapper = useTemplateRef<HTMLDivElement>("skinsWrapper");
const skinsContainer = useTemplateRef<HTMLDivElement>("skinsContainer");
const isGrid = usePersistentRef("isGrid", false);
const isMobile = useMediaQuery("(max-width: 728px)");

const search = ref("");
const filteredSkins = computed(() => {
  if (!skins.value) return [];

  if (isGrid.value) {
    return skins.value.filter((skin) =>
      skin.name.toUpperCase().includes(search.value.toUpperCase()),
    );
  }

  return skins.value;
});

const selectedSkin = ref(-1);
const running = ref(false);

const isZoomed = ref(false);
const zoomedImageIndex = ref(-1);
const expandImage = ref(false);

const { startAutoRotate, stopAutoRotate, onEnter, onLeave } =
  useAutoRotate(skinsContainer);

const onRotationEnd = () => {
  if (!skins.value || selectedSkin.value === -1 || !skinsContainer.value)
    return;

  running.value = false;
  zoomImage(selectedSkin.value);
  if (!isGrid.value) {
    startAutoRotate();
  }
};

const randomizerConfig = {
  skinsContainer,
  selectedSkin,
  skins,
  disabledSkins,
  running,
  isGrid,
  onRotationEnd,
  stopAutoRotate,
};

const { randomize } = useRandomizer(randomizerConfig);

const scale = computed(() => {
  if (!skins.value || !skinsWrapper.value || skins.value.length <= 6) return 1;

  const apothem = calculateApothem(200, skins.value.length);

  let targetApothem;
  if (isMobile.value) {
    targetApothem = skinsWrapper.value.clientHeight / 4;
  } else {
    targetApothem = skinsWrapper.value.clientWidth / 7;
  }

  const scaleValue = targetApothem / apothem;
  return scaleValue;
});

const zoomImage = (index: number) => {
  zoomedImageIndex.value = index;
  isZoomed.value = true;
};

const closeZoom = () => {
  zoomedImageIndex.value = -1;
  isZoomed.value = false;
  expandImage.value = false;
};

const toggleDisableSkin = (num: number) => {
  if (!skins.value || !disabledSkins.value) return;

  const enabledSkins = skins.value.length - disabledSkins.value.length;
  const isDisabled = disabledSkins.value.find((skin) => skin === num);
  console.log(num, enabledSkins, isDisabled);

  if (enabledSkins <= 1 && isDisabled === undefined) {
    return;
  }

  if (isDisabled === undefined) {
    disabledSkins.value = [...disabledSkins.value, num];
  } else {
    disabledSkins.value = disabledSkins.value.filter((skin) => skin !== num);
  }

  // const enabledSkins = skins.value.filter((skin) => skin.enabled === true);
  // const clickedSkin = skins.value.find((skin) => skin.num === num);

  // if (!clickedSkin || (enabledSkins.length <= 1 && clickedSkin.enabled)) {
  //   return;
  // }

  // const skinIsDisabled = Boolean(disabledSkins.value.find((num) => num === clickedSkin.num))
  // if (skinIsDisabled) {
  // }
};

const checkEnable = (num: number) => {
  const isDisabled = disabledSkins.value.find((skin) => skin === num);
  return isDisabled === undefined;
};

const enableAll = () => {
  disabledSkins.value = [];
};

const toggleGrid = (newValue: boolean) => {
  isGrid.value = newValue;

  if (newValue) stopAutoRotate();
  else startAutoRotate();
};

watch(skinsContainer, () => {
  if (!isGrid.value) {
    startAutoRotate();
  }
});

watch(isZoomed, (newValue) => {
  if (newValue) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
});
</script>

<template>
  <h1 v-if="loading">Loading...</h1>
  <h1 v-if="error">
    {{ error }}
  </h1>
  <Transition>
    <div v-if="skins" :class="['container', { grid: isGrid }]">
      <div class="controls">
        <Button
          @click="randomize"
          :disabled="running"
          hover="lighten"
          :icon="isMobile"
        >
          <Dices /> <template v-if="!isMobile">Randomize</template>
        </Button>

        <Input
          :disabled="!isGrid"
          v-model="search"
          placeholder="Search skin"
          divClass="search"
        />

        <div class="toggle-grid">
          <Button
            @click="toggleGrid(true)"
            :disabled="running || isGrid"
            hover="lighten"
            :style="{
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              paddingLeft: '0.75rem',
            }"
            icon
          >
            <LayoutGrid />
          </Button>
          <Button
            @click="toggleGrid(false)"
            :disabled="running || !isGrid"
            hover="lighten"
            :style="{
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              paddingRight: '0.75rem',
            }"
            icon
          >
            <GalleryHorizontal />
          </Button>
        </div>

        <Button
          @click="enableAll"
          :disabled="running || disabledSkins.length === 0"
          hover="lighten"
          icon
        >
          <RotateCcw />
        </Button>
        <InfoTooltip :disabled="running" />
      </div>

      <div class="skins-wrapper" ref="skinsWrapper">
        <div
          class="skins-container"
          :style="{ '--scale': scale }"
          ref="skinsContainer"
        >
          <SkinCard
            v-for="(skin, index) in filteredSkins"
            :index="index"
            :enabled="checkEnable(skin.num)"
            :quantity="skins.length"
            :champion="String(champion)"
            :skin="skin"
            :isGrid="isGrid"
            @leave="onLeave"
            @enter="onEnter"
            @click="toggleDisableSkin"
            @zoom-image="zoomImage"
          />
        </div>
      </div>

      <div v-if="isZoomed" class="zoom-modal" @click="closeZoom">
        <div class="image-container">
          <img
            :src="`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion}_${skins[zoomedImageIndex].num}.jpg`"
            :alt="`${skins[zoomedImageIndex].name} skin`"
            :style="{
              scale: expandImage ? 2 : 1,
              cursor: expandImage ? 'zoom-out' : 'zoom-in',
            }"
            class="zoomed-img"
            @click.stop="expandImage = !expandImage"
          />
          <div class="backdrop" @click.stop>
            <span class="name">{{ skins[zoomedImageIndex].name }}</span>
          </div>
        </div>
        <button class="close-btn" @click="closeZoom">
          <X :size="28" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.container {
  padding-top: 5rem;
  overflow: hidden;
  width: 100%;
  min-height: 100dvh;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.controls {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  max-width: 75vw;
  padding-inline: 1rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.search {
  max-width: 300px;
}

.toggle-grid {
  margin-left: auto;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.container:not(.grid) {
  background: radial-gradient(
    circle at center,
    var(--color-input) 0%,
    rgba(0, 0, 0, 1) 100%
  );
}

.skins-wrapper {
  flex: 1;
  width: 100%;
  overflow: hidden;
  position: relative;

  display: grid;
  place-items: center;
}

.skins-container {
  position: absolute;
  width: 200px;
  height: 113px;
  top: 25%;
  left: calc(50% - 100px);
  transform-style: preserve-3d;
  z-index: 2;
  scale: var(--scale);
  display: flex;
  justify-content: center;
  align-items: center;
}

.container.grid {
  overflow: visible;
}

.container.grid .skins-container {
  display: grid;
  grid-template-columns: repeat(4, minmax(0px, 1fr));
  align-items: flex-start;
  max-width: 75vw;
  position: static;
  scale: 1;
  width: 100%;
  height: 100%;
}

.zoom-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 21;
  animation: showModal 200ms ease;
}

.image-container {
  max-width: 90%;
  max-height: 90%;
  position: relative;
}

.image-container .backdrop {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;

  display: flex;
  flex-direction: column;
  justify-content: end;

  background-image: linear-gradient(
    180deg,
    rgba(38, 38, 38, 0) 50%,
    rgb(22, 22, 22) 100%
  );
}

.image-container .backdrop .name {
  font-family: "Noto Serif", serif;
  text-transform: uppercase;
  font-weight: 400;
  font-size: xx-large;
  padding: 1rem;
  color: #e0e0e0;
}

.zoomed-img {
  width: 100%;
}

.zoom-modal .close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(70, 70, 70, 0.8);
  color: white;
  border: none;
  border-radius: 50%;
  padding: 10px;
  cursor: pointer;
  font-size: 20px;
  aspect-ratio: 1/1;
  display: grid;
  place-items: center;
  z-index: 25;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 300ms ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

@keyframes showModal {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 1024px) {
  .container.grid .skins-container {
    grid-template-columns: repeat(2, minmax(0px, 1fr));
    max-width: 90vw;
  }

  .controls {
    max-width: 90dvw;
  }

  .image-container {
    max-width: 100%;
  }

  .image-container .backdrop .name {
    font-size: medium;
  }
}

@media (max-width: 768px) {
  .controls .search {
    order: 1;
    min-width: 100%;
    max-width: auto;
  }

  .skins-container {
    top: unset;
    bottom: 30%;
    width: 280px;
    height: 157.5px;
    top: calc(50% - 78.75px);
    left: calc(50% - 140px);
  }

  .container.grid .skins-container {
    grid-template-columns: 1fr;
  }
}
</style>
