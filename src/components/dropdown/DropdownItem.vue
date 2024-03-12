<script setup>
import { MenuItem } from "@headlessui/vue";
const props = defineProps({
  description: String,
  as: {
    type: String,
    default: "a"
  }
});
</script>

<template>
  <MenuItem as="li" v-slot="{ active }">
    <component
      :is="props.as"
      :class="{
        'bg-grey-200 text-black ring-2 ring-grey-500': active === true
      }"
      class="block w-full rounded px-5 py-3 text-left text-sm hover:ring-0"
    >
      <slot />
    </component>
  </MenuItem>
</template>
