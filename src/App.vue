<script setup lang="ts">
import Navbar from "./components/global/Navbar.vue";
import VersionError from "./views/components/VersionError.vue";

import BackToTop from "./components/global/BackToTop.vue";
import { useCDNVersion } from "./plugins/CDNVersionPlugin";

const { version, loading } = useCDNVersion();
</script>

<template>
  <Navbar />
  <main>
    <VersionError v-if="!loading && !version" />
    <RouterView v-if="!loading && version" />
  </main>
  <BackToTop />
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
