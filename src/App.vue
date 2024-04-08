<script setup>
import { RouterView } from "vue-router";
import AppNotification from "./components/AppNotification.vue";
import AppNavigation from "./components/AppNavigation.vue";
import AppFooter from "./components/AppFooter.vue";
import SkipToContent from "./components/SkipToContent.vue";
</script>
<template>
  <SkipToContent />
  <div class="flex min-h-screen flex-col">
    <AppNavigation></AppNavigation>
    <RouterView class="flex-1" id="main-content" />
  </div>

  <AppFooter></AppFooter>
  <AppNotification></AppNotification>
</template>
<style scoped></style>
