<script setup>
defineProps({
  srText: String,
  show: { type: Boolean, default: false }
});
</script>

<template>
  <button
    v-if="show"
    class="absolute z-20 my-auto grid place-items-center rounded bg-black/75 text-white shadow-sm outline-none transition-all duration-150 hover:bg-black/90 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 active:bg-black"
  >
    <span class="sr-only">{{ srText }}</span>
    <slot />
  </button>
</template>
