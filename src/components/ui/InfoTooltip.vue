<script setup lang="ts">
import { Info } from "lucide-vue-next";
import { onMounted, onUnmounted, ref, useTemplateRef } from "vue";
import Button from "../ui/Button.vue";

interface Props {
  disabled: boolean;
}

const props = defineProps<Props>();
const open = ref(false);
const coords = ref<[number, number]>([0, 0]);
const button = useTemplateRef("infoButton");

const toggleInfo = () => {
  if (!props.disabled) {
    open.value = !open.value;
  }
};

const closeInfo = (event: MouseEvent) => {
  const targetIsButton = event.target === button.value?.$el;
  const targetIsNode = event.target instanceof Node;
  const buttonContainsTarget = button.value?.$el.contains(event.target as Node);

  if (!(targetIsButton || (targetIsNode && buttonContainsTarget))) {
    open.value = false;
  }
};

const updateTooltipCoords = () => {
  if (!button.value) return;

  const rect = button.value.$el.getBoundingClientRect();
  coords.value = [rect.top + rect.height + 12, rect.left + rect.width / 2];
};

const resizeObserver = new ResizeObserver(updateTooltipCoords);
onMounted(() => resizeObserver.observe(document.body));
onUnmounted(() => resizeObserver.disconnect());
</script>

<template>
  <Button
    @click="toggleInfo"
    :disabled="props.disabled"
    hover="lighten"
    ref="infoButton"
    icon
  >
    <Info />
  </Button>

  <Teleport to="body">
    <div
      v-click-outside="closeInfo"
      :class="['info-balloon', { open }]"
      :aria-hidden="open"
      :style="{
        top: `${coords[0]}px`,
        left: `${coords[1]}px`,
      }"
    >
      Click on any skin to remove it from the draw
    </div>
  </Teleport>
</template>

<style scoped>
.info-balloon {
  position: absolute;
  z-index: 50;
  text-align: justify;
  font-size: small;
  width: 200px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  color: black;
  padding: 10px;
  border-radius: 15px;
  transition: all 200ms;
  border-top-right-radius: 0px;
  opacity: 0;
  visibility: hidden;
  transform: translateX(-100%);
}

.info-balloon::after {
  content: "";
  position: absolute;
  right: 0;
  top: 0;
  transform: translateY(-80%);

  border-left: 10px solid transparent;
  border-bottom: 10px solid white;
}

.info-balloon.open {
  opacity: 1;
  visibility: visible;
}
</style>
