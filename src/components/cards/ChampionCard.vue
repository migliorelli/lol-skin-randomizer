<script setup lang="ts">
import type { Champion } from "../../types/ddragon";

defineProps<Champion>();
</script>

<template>
  <RouterLink :to="{ name: 'champion', params: { id } }" class="champion-card">
    <div class="card-container">
      <img
        :src="`https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${id}_0.jpg`"
        loading="lazy"
        :alt="`${id}'s splash art'`"
      />
      <div class="backdrop">
        <div class="infos">
          <span class="name">{{ name }}</span>
          <span class="title">{{ title }}</span>
        </div>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.champion-card {
  border-radius: 20px;
  border: transparent 4px solid;
  padding: 10px;
  transition: border 200ms;
  color: white;
  user-select: none;
}

.champion-card:hover {
  border-color: #b4b4b4;
}

.card-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  border-radius: 10px;
}

img {
  object-fit: cover;
  height: 100%;
  width: 100%;
  transition: all 150ms;
  transform: scale(1.1);
}

.champion-card:hover img {
  transform: scale(1.2);
}

.backdrop {
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

.infos {
  display: flex;
  flex-direction: column;
  padding: 2rem;
}

.name {
  font-family: "Noto Serif", serif;
  text-transform: uppercase;
  font-weight: 400;
  font-size: xx-large;
}

.title {
  font-size: medium;
  max-height: 0px;
  transition: all 400ms ease;
  opacity: 0;
}

.champion-card:hover .title {
  max-height: 100px;
  opacity: 1;
}

@media (max-width: 1024px) {
  .title {
    max-height: 100px;
    opacity: 1;
  }
}
</style>
