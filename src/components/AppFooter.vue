<script setup>
// #region -IMPORTS-
// Vue-related imports
import { computed } from "vue";
import { RouterLink } from "vue-router";

// Custom module/helper imports
import { AuthStateManager } from "@/helper/AuthStateManager";
// #endregion

const baseFooterLinks = [
  { name: "Auctions", route: { name: "auctions" }, id: 1 },
  { name: "Create auction", route: { name: "create" }, id: 2 }
];

const footerLinks = computed(() => {
  if (AuthStateManager.isAuthenticated()) {
    return [
      ...baseFooterLinks,
      {
        name: "Profile",
        route: { name: "profile", params: { username: AuthStateManager.getUsername() } },
        id: 3
      }
    ];
  } else {
    return [...baseFooterLinks, { name: "Register", route: { name: "register" }, id: 3 }];
  }
});
</script>

<template>
  <footer class="bg-black py-5 text-white">
    <div
      class="mx-auto flex max-w-8xl flex-col justify-between gap-3 px-5 md:flex-row md:items-center"
    >
      <RouterLink
        :to="{ name: 'home' }"
        class="rounded p-3 font-accent text-lg font-semibold outline-none transition-all duration-150 hover:text-grey-300 focus-visible:ring-2 focus-visible:ring-white sm:text-xl"
        >BidQuest</RouterLink
      >
      <ul class="flex gap-5">
        <li v-for="link of footerLinks" :key="link.id">
          <RouterLink
            class="rounded p-3 outline-none transition-all duration-150 hover:text-grey-300 focus-visible:ring-2 focus-visible:ring-white"
            :to="link.route"
            >{{ link.name }}</RouterLink
          >
        </li>
      </ul>

      <span class="mt-5 text-grey-300 md:mt-0">&copy; 2024 Martekn</span>
    </div>
  </footer>
</template>
