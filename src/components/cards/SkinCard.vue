<script setup lang="ts">
import { ZoomIn } from "lucide-vue-next";
import useMediaQuery from "../../composables/useMediaQuery";
import type { Skin } from "../../types/ddragon";
import { capitalize } from "../../utils";

interface Props {
  skin: Skin;
  champion: string;
  index: number;
  quantity: number;
  enabled: boolean;
  isGrid: boolean;
}

interface Emits {
  (event: "click", num: number): void;
  (event: "leave"): void;
  (event: "enter"): void;
  (event: "zoomImage", index: number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const isMobile = useMediaQuery();

const onEnter = () => {
  emit("enter");
};

const onLeave = () => {
  emit("leave");
};

const onClick = () => {
  emit("click", props.skin.num);
};

const onZoomImage = () => {
  emit("zoomImage", props.index);
};
</script>

<template>
  <div
    :key="skin.id"
    :id="skin.id"
    :style="{ '--position': index + 1, '--quantity': quantity }"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
    @click="onClick"
    :class="['item', { disabled: !enabled, grid: isGrid, mobile: isMobile }]"
    role="button"
  >
    <div class="item-container">
      <template v-if="isGrid">
        <img
          :src="`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champion}_${skin.num}.jpg`"
          :alt="`${skin.name} skin`"
          :id="`${champion}_${skin.num}`"
        />
        <div class="backdrop">
          <div class="infos">
            <span class="name">{{ skin.name }}</span>
          </div>
        </div>
        <button class="zoom-btn" @click.stop="onZoomImage">
          <ZoomIn :size="32" />
        </button>
      </template>

      <template v-else>
        <img
          :src="`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion}_${skin.num}.jpg`"
          :alt="`${skin.name} skin`"
          :id="`${champion}_${skin.num}`"
        />
        <div class="name">{{ capitalize(skin.name) }}</div>
        <button class="zoom-btn" @click.stop="onZoomImage">
          <ZoomIn :size="16" />
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.item {
  user-select: none;
  position: absolute;
  inset: 0 0 0 0;
  cursor: pointer;
  border-radius: 20px;
  border: transparent 4px solid;
  transition: all linear 200ms;
  transform: rotateY(
      calc((var(--position) - 1) * (360 / var(--quantity)) * 1deg)
    )
    translateZ(calc(130px * (1 + (var(--quantity) - 1) * 0.25)));
}

.item.mobile {
  transform: rotateX(
      calc((var(--position) - 1) * (360 / var(--quantity)) * 1deg)
    )
    translateZ(calc(130px * (1 + (var(--quantity) - 1) * 0.25)));
}

.item-container {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 10px;
}

.item:not(.grid) .name {
  font-size: medium;
  max-height: 0px;
  transition: all 400ms ease;
  opacity: 0;
  text-align: center;
}

.item:not(.grid):hover .name {
  max-height: 100px;
  width: 100%;
  opacity: 1;
}

.item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
}

.item.disabled img {
  filter: grayscale(1) brightness(0.75);
}

.item .zoom-btn {
  opacity: 0;
  transition: opacity 200ms linear;
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: white;
  z-index: 10;
  aspect-ratio: 1/1;
  display: grid;
  place-items: center;
}

.item:hover .zoom-btn {
  opacity: 1;
}

.item .zoom-btn:focus {
  opacity: 1;
}

.item:not(.grid):hover {
  transform: rotateY(
      calc((var(--position) - 1) * (360 / var(--quantity)) * 1deg)
    )
    translateZ(calc(130px * (1 + (var(--quantity) - 1) * 0.25))) scale(1.15)
    translateY(-50px);
}

.item.mobile:not(.grid):hover {
  transform: rotateX(
      calc((var(--position) - 1) * (360 / var(--quantity)) * 1deg)
    )
    translateZ(calc(130px * (1 + (var(--quantity) - 1) * 0.25))) scale(1.15)
    translateY(-50px);
}

.item:hover .zoom-btn {
  opacity: 1;
}

.item .backdrop {
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

.item.grid {
  position: relative;
  transform: none;
  border-width: 4px;
  padding: 10px;
}

.item.grid .zoom-btn {
  padding: 10px;
}

.item.grid:hover {
  border-color: #b4b4b4;
}

.item.grid .item-container {
  overflow: hidden;
}

.item.grid img {
  transform: scale(1.1);
  transition: all 200ms;
}

.item.grid:hover img {
  transform: scale(1.2);
}

.item .infos {
  display: flex;
  flex-direction: column;
  padding: 2rem;
}

.item .infos .name {
  font-family: "Noto Serif", serif;
  text-transform: uppercase;
  font-weight: 400;
  font-size: xx-large;
}

@media (max-width: 1024px) {
  .item .zoom-btn {
    opacity: 1;
  }
}
</style>
