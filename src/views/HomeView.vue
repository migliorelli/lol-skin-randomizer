<script setup lang="ts">
import { Dices } from "lucide-vue-next";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import ChampionCard from "../components/cards/ChampionCard.vue";
import Button from "../components/ui/Button.vue";
import Input from "../components/ui/Input.vue";
import useAsync from "../composables/useAsync";
import { fetchChampions } from "../services/ddragon";
import type { Champion } from "../types/ddragon";

const { data, error, loading } = useAsync<Champion[]>(fetchChampions());
const search = ref("");
const router = useRouter();

const champions = computed(() =>
  data.value
    ? data.value.filter((champion) =>
        champion.id.toUpperCase().includes(search.value.toUpperCase()),
      )
    : [],
);

const pickRandom = () => {
  if (!data.value) return;

  const randomChampion =
    data.value[Math.floor(Math.random() * data.value.length)];
  router.push(`/${randomChampion.id}`);
};
</script>

<template>
  <div class="container">
    <div class="hero">
      <span class="title">LoL Skin Randomizer</span>
      <div class="search-container">
        <Button
          @click="pickRandom"
          :disabled="loading && !error"
          hover="lighten"
          v-tooltip:bottom="'Pick random'"
          icon
        >
          <Dices />
        </Button>
        <Input
          v-model="search"
          placeholder="Champion name"
          :disabled="loading && !error"
        />
      </div>
    </div>
    <h1 v-if="loading">Loading...</h1>
    <h1 v-if="error">
      {{ error }}
    </h1>
    <Transition>
      <div class="champion-grid" v-if="!loading && !error">
        <ChampionCard
          v-for="champion in champions"
          :key="champion.id"
          v-bind="champion"
        />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-top: 4rem;
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem 1rem;
  border-radius: 15px;
  width: 100%;
  max-width: 900px;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--color-title, #ffffff);
}

.search-container {
  display: flex;
  width: 100%;
  margin-top: 1rem;
  max-width: 600px;
  gap: 0.5rem;
}

.champion-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0px, 1fr));
  gap: 15px;
  max-width: 75vw;
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
  .champion-grid {
    grid-template-columns: repeat(2, minmax(0px, 1fr));
    max-width: 90vw;
  }

  .hero {
    padding: 1rem;
    gap: 0.5rem;
  }

  .title {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .hero {
    width: 100%;
    padding-inline: 2rem;
  }

  input {
    padding: 0.5rem;
  }
}
</style>
