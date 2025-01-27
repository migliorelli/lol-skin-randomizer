<script setup lang="ts">
import { Dices, Github } from "lucide-vue-next";
import { onMounted, onUnmounted, ref, useTemplateRef } from "vue";
import { RouterLink } from "vue-router";

const isScrolled = ref(false);
const navbar = useTemplateRef("navbar");

const handleScroll = () => {
  if (navbar.value) {
    isScrolled.value = window.scrollY > navbar.value.clientHeight * 0.1;
  }
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <nav :class="['navbar', { 'navbar-scrolled': isScrolled }]" ref="navbar">
    <div class="navbar-container">
      <RouterLink to="/" class="navbar-logo">
        <Dices :size="32" />
        <span>Randomizer</span>
      </RouterLink>
      <a
        href="https://github.com/migliorelli"
        class="link icon"
        target="_blank"
      >
        <Github color="#dfdfdf" :size="32" />
      </a>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  height: 3rem;
  padding: 2.5rem 1rem;
  background-color: transparent;
  transition: all 200ms;
  z-index: 20;
}

.navbar-scrolled {
  background-color: rgb(10, 10, 10, 0.8);
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 6px #0a0a0a1a;
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.navbar-logo {
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 15px;
  transition: all 200ms;
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 1ch;
  color: var(--color-primary);
}

.navbar-logo span {
  font-size: 1.5rem;
  font-weight: bold;
  color: #dfdfdf;
}

.navbar-logo span::first-letter {
  color: var(--color-primary);
}

.navbar-logo:hover {
  background-color: var(--color-input);
}

.navbar-logo:active {
  scale: 0.95;
}

.spacer {
  flex: 1;
}

.link {
  transition: all 200ms;
  padding: 0.5rem 1rem;
  border-radius: 15px;
}

.link.icon {
  aspect-ratio: 1/1;
  display: grid;
  padding: 0.5rem;
  place-items: center;
}

.link:hover {
  background-color: var(--color-input);
}

.link:active {
  scale: 0.9;
}
</style>
