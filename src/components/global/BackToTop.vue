<script setup lang="ts">
import { ChevronUp } from "lucide-vue-next";
import { onMounted, onUnmounted, ref } from "vue";

const show = ref(false);

const scrollUp = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const handleScroll = () => {
  show.value = window.scrollY > window.innerHeight;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <Transition>
    <button @click="scrollUp" v-if="show">
      <ChevronUp :size="32" />
    </button>
  </Transition>
</template>

<style scoped>
button {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 50%;
  padding: 10px;
  cursor: pointer;
  font-size: 20px;
  aspect-ratio: 1/1;
  display: grid;
  place-items: center;
  z-index: 30;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
