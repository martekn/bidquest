<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <footer class="bg-black py-5 text-white">
    <div
      class="mx-auto flex max-w-8xl flex-col justify-between gap-3 px-5 md:flex-row md:items-center"
    >
      <RouterLink
        to="/"
        class="rounded p-3 font-accent text-lg font-semibold outline-none hover:text-grey-300 focus-visible:ring-2 focus-visible:ring-white sm:text-xl"
        >BidQuest</RouterLink
      >
      <ul class="flex gap-5">
        <li>
          <RouterLink
            class="rounded p-3 outline-none hover:text-grey-300 focus-visible:ring-2 focus-visible:ring-white"
            to="/auctions"
            >Auctions</RouterLink
          >
        </li>
        <li>
          <RouterLink
            class="rounded p-3 outline-none hover:text-grey-300 focus-visible:ring-2 focus-visible:ring-white"
            to="/auction/create"
            >Create auction</RouterLink
          >
        </li>
        <li>
          <RouterLink
            class="rounded p-3 outline-none hover:text-grey-300 focus-visible:ring-2 focus-visible:ring-white"
            to="/register"
            >Register</RouterLink
          >
        </li>
      </ul>

      <span class="mt-5 text-grey-300 md:mt-0">&copy; 2024 Martekn</span>
    </div>
  </footer>
</template>
