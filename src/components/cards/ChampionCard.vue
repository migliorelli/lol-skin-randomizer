<script setup lang="ts">
import { Star } from "lucide-vue-next";
import { useRouter } from "vue-router";
import type { Champion } from "../../types/ddragon";

const router = useRouter();

interface Props extends Champion {
  favorite: boolean;
}

interface Emits {
  (event: "favorite"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const onFavorite = () => {
  emit("favorite");
};

const onClick = () => {
  router.push(props.id);
};
</script>

<template>
  <div role="button" @click="onClick" class="champion-card">
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

      <button :class="['fav-btn', { favorite }]" @click.stop="onFavorite">
        <Star
          :size="32"
          :color="favorite ? '#fff085' : undefined"
          :fill="favorite ? '#fff085' : '#00000000'"
        />
      </button>
    </div>
  </div>
</template>

<style scoped>
.champion-card {
  border-radius: 20px;
  border: transparent 4px solid;
  aspect-ratio: 9/16;
  padding: 10px;
  transition: border 200ms;
  color: white;
  user-select: none;
  position: relative;
  cursor: pointer;
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
  font-size: x-large;
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

.champion-card .fav-btn {
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

.champion-card:hover .fav-btn {
  opacity: 1;
}

.champion-card .fav-btn:focus {
  opacity: 1;
}

.fav-btn.favorite {
  opacity: 1;
}

@media (max-width: 1024px) {
  .infos {
    padding: 1rem;
  }

  .name {
    font-size: large;
  }

  .title {
    max-height: 100px;
    opacity: 1;
  }

  .champion-card .fav-btn {
    opacity: 1;
  }
}
</style>
