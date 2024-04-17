<script setup>
// #region -IMPORTS-
// Third-party library imports
import { XCircleIcon } from "@heroicons/vue/20/solid";
// #endregion

defineProps({
  title: { type: String, default: "Error" },
  id: { type: String }
});
</script>

<template>
  <div :id="id" class="flex w-full items-start gap-3 rounded bg-red-300 p-5">
    <XCircleIcon class="my-1 h-5 w-5 flex-shrink-0 text-red-400" />

    <div class="flex flex-col gap-2">
      <span class="font-semibold leading-tight">{{ title }}</span>

      <slot></slot>
    </div>
  </div>
</template>
