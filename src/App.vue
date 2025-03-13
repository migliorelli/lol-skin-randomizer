<script setup lang="ts">
import BackToTop from "./components/global/BackToTop.vue";
import Navbar from "./components/global/Navbar.vue";
import { useCDNVersion } from "./plugins/CDNVersionPlugin";
import VersionError from "./views/components/VersionError.vue";

const { version, loading } = useCDNVersion();
</script>

<template>
  <!-- app -->
  <Navbar />
  <main>
    <VersionError v-if="!loading && !version" />
    <RouterView v-if="!loading && version" />
  </main>
  <BackToTop />
  <!-- app -->
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
