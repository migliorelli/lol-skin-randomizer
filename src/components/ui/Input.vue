<script setup lang="ts">
import { X } from "lucide-vue-next";
import type { InputHTMLAttributes, StyleValue } from "vue";
import { computed } from "vue";

interface Props {
  modelValue: string;
  type?: InputHTMLAttributes["type"];
  disabled?: boolean;
  style?: StyleValue;
  placeholder?: string;
  divClass?: string;
  class?: string;
}

interface Emits {
  (event: "update:modelValue", value: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const handleInput = (event: Event) => {
  emit("update:modelValue", (event.target as HTMLInputElement).value);
};

const clearInput = () => {
  emit("update:modelValue", "");
};

const inputAttrs = computed(() => {
  const { modelValue, divClass, ...attrs } = props;
  return attrs;
});
</script>

<template>
  <div :class="divClass">
    <input v-bind="inputAttrs" :value="modelValue" @input="handleInput" />
    <button
      class="clear-button"
      :disabled="disabled"
      @click="clearInput"
      v-if="modelValue.length > 0"
    >
      <X :size="20" />
    </button>
  </div>
</template>

<style scoped>
div {
  flex: 1;
  position: relative;
  height: 40px;
  display: flex;
  justify-content: start;
  align-items: center;
}

input {
  width: 100%;
  flex: 1;
  background-color: var(--color-input);
  outline: none;
  color: white;
  font-family: "Merriweather Sans", serif;
  padding: 0.75rem 1rem;
  border-radius: 15px;
  height: 40px;
  border: 2px solid transparent;
  transition: all 300ms ease;
}

input:focus {
  border-color: #b4b4b4;
}

input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.clear-button {
  border-radius: 15px;
  aspect-ratio: 1/1;
  display: grid;
  place-items: center;
  size: 40px;
  outline: none;
  border: none;
  background-color: transparent;
  cursor: pointer;
  color: white;
  height: 40px;

  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

.clear-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
