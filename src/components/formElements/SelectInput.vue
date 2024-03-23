<script setup>
import { ref } from "vue";
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions
} from "@headlessui/vue";
import { ChevronUpDownIcon } from "@heroicons/vue/20/solid";

const props = defineProps({
  name: { type: String, default: "" },
  options: {
    type: Array,
    default: () => []
  },
  label: { type: String, default: "" },
  placeholder: { type: String, default: "Select" }
});

const selected = ref(props.placeholder);
</script>

<template>
  <Listbox as="div" v-model="selected">
    <ListboxLabel>{{ label }}</ListboxLabel>
    <div class="relative mt-2">
      <ListboxButton
        class="w-full rounded border border-grey-400 bg-white p-3 text-left outline-none focus-visible:ring-1 focus-visible:ring-black"
      >
        <span
          class="ml-3 block truncate pr-5"
          :class="{ 'text-grey-500': !!selected.label !== true }"
        >
          {{ selected.label ? selected.label : selected }}
        </span>

        <span class="inset-y-0 right-0 pointer-events-none absolute ml-5 flex items-center pr-3">
          <ChevronUpDownIcon class="h-5 w-5 text-grey-500" aria-hidden="true" />
        </span>
      </ListboxButton>

      <ListboxOptions
        class="z-10 mt-2 max-h-[12rem] w-full overflow-auto rounded border border-grey-300 bg-white py-1 text-sm shadow-md shadow-black/5 focus:outline-none"
      >
        <ListboxOption
          as="template"
          v-for="option in options"
          :key="option.value"
          :value="option"
          v-slot="{ active, selected }"
        >
          <li
            class="cursor-pointer border-y border-dotted px-3 py-2"
            :class="{
              ' border-black': active === true,
              ' border-transparent': active === false,
              'bg-grey-300/50': active === true && selected === false,
              'bg-primary-400 text-white': selected === true,
              'bg-primary-300 text-white': selected === true && active === true
            }"
          >
            {{ option.label }}
          </li>
        </ListboxOption>
      </ListboxOptions>
    </div>
  </Listbox>
</template>
