<script setup>
import { ref } from "vue";
import { MagnifyingGlassIcon } from "@heroicons/vue/20/solid";
import router from "@/router";
let searchInput = ref("");
</script>

<template>
  <form @submit.prevent role="search" class="relative text-grey-500 focus-within:text-black">
    <label for="searchInput" class="sr-only">Search</label>
    <input
      class="placeholder:grey-500"
      placeholder="Search"
      type="text"
      id="searchInput"
      v-model="searchInput"
    />

    <button
      @click="
        () => {
          router.push({ name: 'search', params: { query: searchInput } });
        }
      "
      :class="{ 'pointer-events-none': !!searchInput === false }"
      :disabled="!!searchInput === false"
      class="focus-visible:inner-border-off absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 transform place-items-center self-stretch rounded transition-all duration-150 inner-border-black hover:bg-grey-300/50 focus-visible:bg-primary-400 focus-visible:text-white focus-visible:outline-none"
    >
      <span class="sr-only">Search</span>
      <MagnifyingGlassIcon class="h-[1.3rem] w-[1.3rem]" />
    </button>
  </form>
</template>
