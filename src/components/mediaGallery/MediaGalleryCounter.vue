<script setup>
defineProps({
  show: { type: Boolean, default: false },
  currentImage: Number,
  imagesCount: Number
});
</script>

<template>
  <div
    v-if="show"
    class="absolute inset-x-0 bottom-0 z-20 mx-auto mb-6 grid h-7 w-9 place-items-center rounded bg-black/75 text-white shadow-sm transition-all"
  >
    {{ currentImage }}/{{ imagesCount }}
  </div>
</template>
