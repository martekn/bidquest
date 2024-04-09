<script setup>
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";

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
  <Popover as="div" class="group relative inline-block text-left">
    <div>
      <PopoverButton
        as="template"
        class="ui-focus-visible:rounded ui-focus-visible:ring-1 ui-focus-visible:ring-black"
        ><slot
      /></PopoverButton>
    </div>

    <PopoverPanel
      :class="{
        'right-0': props.align === 'right',
        'left-0': props.align === 'left'
      }"
      class="absolute z-30 mt-2 max-w-[80vw] divide-y divide-grey-300 rounded border border-grey-300 bg-white text-grey-500 shadow-md shadow-black/5 focus:outline-none"
      :style="{ width: props.width }"
    >
      <slot name="items" />
    </PopoverPanel>
  </Popover>
</template>
