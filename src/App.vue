<script setup>
// #region -IMPORTS-
// Vue-related imports
import { RouterView } from "vue-router";

// Custom module/helper imports
import { resetFocus } from "./helper/resetFocus";

// Custom components
import AppNotification from "@/components/AppNotification.vue";
import AppNavigation from "@/components/AppNavigation.vue";
import AppFooter from "@/components/AppFooter.vue";
import SkipToContent from "@/components/SkipToContent.vue";
import FadeTransition from "@/components/FadeTransition.vue";
// #endregion

resetFocus();
</script>
<template>
  <SkipToContent />
  <div class="flex min-h-screen flex-col">
    <AppNavigation></AppNavigation>
    <RouterView class="flex-1" id="main-content" v-slot="{ Component }">
      <FadeTransition>
        <component :is="Component" />
      </FadeTransition>
    </RouterView>
  </div>

  <AppFooter></AppFooter>
  <AppNotification></AppNotification>
</template>
<style scoped></style>
