<script setup lang="ts">
import type { ButtonHTMLAttributes } from "vue";

interface Props {
  type?: ButtonHTMLAttributes["type"];
  disabled?: boolean;
}

interface Emits {
  (event: "click", nativeEvent: MouseEvent): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const onClick = (event: MouseEvent) => {
  emit("click", event);
};
</script>

<template>
  <button v-bind="props" @click="onClick">
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
  font-family: "Marcellus SC", serif;
  font-size: 15px;
  font-weight: bold;
  letter-spacing: 1px;
  padding: 5px 15px;
  background: #1e2328;
  color: #cdbe91;
  box-shadow: inset 0 0 2px #000000;
  border-image: linear-gradient(to bottom, #c8aa6d, #7a5c29);
  border-image-slice: 1;
  border-width: 2px;
  outline: none;
}

button:hover {
  text-shadow: 0 0 5px #ffffff80;
  box-shadow: 0 0 8px 0 #ffffff50;
  background: linear-gradient(to bottom, #1e2328, #433d2b);
  cursor: pointer;
  transition: 0.1s;
}

button:active {
  text-shadow: none;
  box-shadow: none;
  color: #cdbe9130;
}
</style>
