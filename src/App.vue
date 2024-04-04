<script setup>
import { RouterView } from "vue-router";
import AppNavigation from "./components/AppNavigation.vue";
import AppFooter from "./components/AppFooter.vue";
</script>
<template>
  <div class="flex min-h-screen flex-col">
    <AppNavigation></AppNavigation>
    <RouterView />
  </div>

  <AppFooter></AppFooter>
</template>
<style scoped></style>
