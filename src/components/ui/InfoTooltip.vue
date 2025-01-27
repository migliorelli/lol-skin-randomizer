<script setup lang="ts">
import { Info } from "lucide-vue-next";
import { ref, useTemplateRef, watch } from "vue";
import useDimensions from "../../composables/useDimensions";
import Button from "../ui/Button.vue";

interface Props {
  disabled: boolean;
}

const props = defineProps<Props>();
const open = ref(false);
const coords = ref<[number, number]>([0, 0]);
const button = useTemplateRef("infoButton");
const dimensions = useDimensions();

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

watch([button, dimensions], () => {
  if (button.value) {
    const rect = button.value.$el.getBoundingClientRect();
    coords.value = [rect.top + rect.height + 12, rect.left + rect.width / 2];
  }
});
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
    <Transition>
      <div
        v-click-outside="closeInfo"
        v-if="open"
        class="info-balloon"
        :style="{
          top: `${coords[0]}px`,
          left: `${coords[1]}px`,
        }"
      >
        Click on any skin to remove it from the draw
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.info-balloon {
  position: absolute;
  z-index: 50;
  text-align: justify;
  font-size: small;
  max-width: 200px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  color: black;
  padding: 10px;
  border-radius: 15px;
  border-top-right-radius: 0px;
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

.v-enter-active,
.v-leave-active {
  transition: opacity 300ms ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

@media (max-width: 1024px) {
  .info-balloon {
    max-width: 100dvw;
  }
}
</style>
