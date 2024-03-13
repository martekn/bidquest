<script setup>
import { ref } from "vue";
import { MagnifyingGlassIcon } from "@heroicons/vue/20/solid";
let searchInput = ref("");
</script>

<template>
  <form role="search" class="relative text-grey-500 focus-within:text-black">
    <label for="searchInput" class="sr-only">Search</label>
    <input type="text" class="" v-model="searchInput" />

    <button
      @click="
        () => {
          $router.push({ path: '/search/' + searchInput });
        }
      "
      :class="{ 'pointer-events-none': !!searchInput === false }"
      :disabled="!!searchInput === false"
      class="focus-visible:inner-border-off absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 transform place-items-center self-stretch rounded inner-border-black hover:bg-grey-300/50 focus-visible:bg-primary-400 focus-visible:text-white focus-visible:outline-none"
    >
      <MagnifyingGlassIcon class="h-[1.3rem] w-[1.3rem]" />
    </button>
  </form>
</template>
