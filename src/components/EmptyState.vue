<script setup>
import { DocumentMinusIcon, DocumentMagnifyingGlassIcon } from "@heroicons/vue/24/outline";
defineProps({
  title: { type: String, default: "Empty state" },
  text: String,
  type: {
    type: String,
    default: "auction",
    validator: (value) => ["auction", "search"].includes(value)
  }
});
</script>
<template>
  <div class="mx-auto grid max-w-xl place-items-center py-10 text-center">
    <DocumentMagnifyingGlassIcon
      v-if="type === 'search'"
      class="m-5 mt-0 h-10 w-10 text-sm [&>path]:stroke-[0.7]"
    />
    <DocumentMinusIcon
      v-if="type === 'auction'"
      class="m-5 mt-0 h-10 w-10 text-sm [&>path]:stroke-[0.7]"
    />
    <h2 class="mt-2">{{ title }}</h2>
    <p class="mt-2 text-grey-500">{{ text }}</p>
    <slot></slot>
  </div>
</template>
