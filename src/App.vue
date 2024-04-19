<script setup>
// #region -IMPORTS-
// Vue-related imports
import { nextTick } from "vue";
import { RouterView, useRouter } from "vue-router";

// Custom components
import AppNotification from "@/components/AppNotification.vue";
import AppNavigation from "@/components/AppNavigation.vue";
import AppFooter from "@/components/AppFooter.vue";
import SkipToContent from "@/components/SkipToContent.vue";
// #endregion

const router = useRouter();

router.afterEach((from, to) => {
  if (
    to.name === "history" &&
    from.name === "history" &&
    (from.params.view === "all" || from.params.view === "wins")
  ) {
    return;
  } else if (
    to.name === "profile" &&
    from.name === "profile" &&
    (from.params.view === "all" || from.params.view === "active")
  ) {
    return;
  } else if (from.path !== to.path) {
    nextTick(() => {
      document.body.tabIndex = 0;
      document.body.focus();
      document.body.tabIndex = -1;
    });
  }
});
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
