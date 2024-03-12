<script setup>
import { Menu, MenuButton, MenuItems } from "@headlessui/vue";
const props = defineProps({
  align: {
    type: String,
    default: "left",
    validator: (value) => ["left", "right"].includes(value)
  },
  width: { type: String, default: "10rem" }
});
</script>
<template>
  <Menu as="div" class="group relative inline-block text-left">
    <div>
      <MenuButton as="template"><slot /></MenuButton>
    </div>

    <MenuItems
      :class="{
        'right-[0px]': props.align === 'right',
        'left-[0px]': props.align === 'left'
      }"
      class="absolute z-10 mt-2 max-w-[80vw] divide-y divide-grey-300 rounded border border-grey-300 bg-white text-grey-500 shadow-md shadow-black/5 focus:outline-none"
      :style="{ width: props.width }"
    >
      <slot name="items" />
    </MenuItems>
  </Menu>
</template>
