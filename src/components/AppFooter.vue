<script setup>
import { RouterLink } from "vue-router";

const footerLinks = [
  { name: "Auctions", path: "/auctions", id: 1 },
  { name: "Create auction", path: "/auction/create", id: 2 },
  { name: "Register", path: "/register", id: 3 }
];
</script>

<template>
  <footer class="bg-black py-5 text-white">
    <div
      class="mx-auto flex max-w-8xl flex-col justify-between gap-3 px-5 md:flex-row md:items-center"
    >
      <RouterLink
        to="/"
        class="rounded p-3 font-accent text-lg font-semibold outline-none transition-all duration-150 hover:text-grey-300 focus-visible:ring-2 focus-visible:ring-white sm:text-xl"
        >BidQuest</RouterLink
      >
      <ul class="flex gap-5">
        <li v-for="link of footerLinks" :key="link.id">
          <RouterLink
            class="rounded p-3 outline-none transition-all duration-150 hover:text-grey-300 focus-visible:ring-2 focus-visible:ring-white"
            :to="link.path"
            >{{ link.name }}</RouterLink
          >
        </li>
      </ul>

      <span class="mt-5 text-grey-300 md:mt-0">&copy; 2024 Martekn</span>
    </div>
  </footer>
</template>
