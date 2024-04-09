<script setup>
import { RouterLink } from "vue-router";

const props = defineProps({
  description: String,
  as: {
    type: String,
    default: "a"
  },
  routerLink: { type: Boolean, default: false },
  route: { type: Object }
});

const classes =
  "block w-full relative rounded px-5 py-3 text-left text-sm outline-none transition-all duration-150 hover:bg-grey-200 hover:text-black hover:ring-0 focus-visible:inner-border-2 focus-visible:inner-border-black [&.router-link-active]:font-semibold [&.router-link-active]:after:absolute [&.router-link-active]:after:inset-y-0 [&.router-link-active]:after:inset-y-0 [&.router-link-active]:after:left-0 [&.router-link-active]:after:block [&.router-link-active]:after:w-2 [&.router-link-active]:after:rounded [&.router-link-active]:after:bg-primary-400";
</script>

<template>
  <li>
    <component v-if="!routerLink" :is="props.as" :class="classes">
      <slot />
    </component>
    <RouterLink v-else :class="classes" :to="props.route"><slot /></RouterLink>
  </li>
</template>
