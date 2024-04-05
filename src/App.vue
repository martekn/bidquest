<script setup>
import { RouterView } from "vue-router";
import AppNotification from "./components/AppNotification.vue";
import AppNavigation from "./components/AppNavigation.vue";
import AppFooter from "./components/AppFooter.vue";
</script>
<template>
  <div class="flex min-h-screen flex-col">
    <AppNavigation></AppNavigation>
    <RouterView />
  </div>

  <AppFooter></AppFooter>
  <AppNotification></AppNotification>
</template>
<style scoped></style>