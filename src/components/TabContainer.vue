<script setup>
// #region -IMPORTS-
// Vue-related imports
import { RouterLink } from "vue-router";
// #endregion

defineProps({
  tabs: Array
});
</script>
<template>
  <div>
    <div class="flex gap-9 border-b border-b-grey-300 text-sm font-medium">
      <RouterLink
        v-for="{ id, active, route, label, count } of tabs"
        :key="id"
        :class="{
          ' border-b-primary-400': active,
          ' border-b-transparent': !active
        }"
        class="relative -bottom-1 border-b-[3px] p-1 outline-none transition-all hover:text-grey-500 focus-visible:rounded focus-visible:ring-2 focus-visible:ring-black"
        :to="route"
        >{{ label }} <span class="text-grey-500">({{ count ?? 0 }})</span></RouterLink
      >
    </div>
    <slot />
  </div>
</template>
