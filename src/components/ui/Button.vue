<script setup lang="ts">
import {
  computed,
  useTemplateRef,
  type ButtonHTMLAttributes,
  type StyleValue,
} from "vue";

interface Props {
  type?: ButtonHTMLAttributes["type"];
  disabled?: boolean;
  style?: StyleValue;
  icon?: boolean;
  hover?: "lighten" | "darken" | "default";
}

interface Emits {
  (event: "click", nativeEvent: MouseEvent): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const button = useTemplateRef("button");

const hoverClass = computed(() => `hover-${props.hover}`);

const onClick = (event: MouseEvent) => {
  emit("click", event);
};

defineExpose({ button });
</script>

<template>
  <button
    ref="button"
    :type="props.type"
    :disabled="props.disabled"
    :style="props.style"
    :class="{ icon: props.icon, [hoverClass]: props.hover }"
    @click="onClick"
  >
    <slot />
  </button>
</template>

<style scoped>
div {
  width: 100%;
  height: 100%;
  background: #030910;
  display: flex;
  justify-content: center;
  align-items: center;
}

button {
  font-weight: bold;
  font-family: "Merriweather Sans", serif;
  border-radius: 15px;
  padding: 0.5rem 1rem;
  letter-spacing: 1.5px;
  outline: none;
  border: none;
  background-color: var(--color-primary);
  cursor: pointer;
  color: white;
  display: flex;
  height: 40px;
  justify-content: start;
  align-items: center;
  gap: 1ch;
  transition: filter 300ms ease;
}

button.icon {
  aspect-ratio: 1/1;
  display: grid;
  place-items: center;
  padding: 0.5rem;
  size: 40px;
}

button:not(:disabled).hover-lighten:hover {
  filter: brightness(1.2);
}

button:not(:disabled).hover-darken:hover {
  filter: brightness(0.8);
}

button:disabled {
  filter: brightness(0.5) grayscale(0.5);
  cursor: not-allowed;
}
</style>
