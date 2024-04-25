<script setup>
const props = defineProps({
  color: {
    type: String,
    default: "primary",
    validator: (value) => ["primary", "light", "dark"].includes(value)
  },
  size: {
    type: String,
    default: "0.5rem"
  }
});
</script>
<template>
  <span class="flex min-h-6 items-center justify-center space-x-2 leading-tight">
    <span class="sr-only">Loading...</span>
    <span
      :style="{ height: props.size, width: props.size }"
      class="animate-bounce rounded-full [animation-delay:-0.3s]"
      :class="{
        'bg-primary-400': color === 'primary',
        'bg-grey-400': color === 'dark',
        'bg-white': color === 'light'
      }"
    ></span>
    <span
      :style="{ height: props.size, width: props.size }"
      class="animate-bounce rounded-full [animation-delay:-0.15s]"
      :class="{
        'bg-primary-400': color === 'primary',
        'bg-grey-400': color === 'dark',
        'bg-white': color === 'light'
      }"
    ></span>
    <span
      :style="{ height: props.size, width: props.size }"
      class="animate-bounce rounded-full"
      :class="{
        'bg-primary-400': color === 'primary',
        'bg-grey-400': color === 'dark',
        'bg-white': color === 'light'
      }"
    ></span>
  </span>
</template>
