<script setup>
import { RouterLink } from "vue-router";

const props = defineProps({
  description: String,
  as: {
    type: String,
    default: "a"
  },
  routerLink: { type: Boolean, default: false },
  path: { type: String, default: "" }
});

const classes =
  "block w-full rounded px-5 py-3 text-left text-sm outline-none hover:bg-grey-200 hover:text-black hover:ring-0 focus-visible:inner-border-2 focus-visible:inner-border-black";
</script>

<template>
  <li>
    <component v-if="!routerLink" :is="props.as" :class="classes" v-bind="$attrs">
      <slot />
    </component>
    <RouterLink v-else :class="classes" :to="props.path"><slot /></RouterLink>
  </li>
</template>
