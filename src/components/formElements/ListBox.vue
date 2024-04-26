<script setup>
// #region -IMPORTS-
// Vue-related imports
import { computed } from "vue";

// Third-party library imports
import {
  ListboxLabel,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions
} from "@headlessui/vue";
import { ChevronUpDownIcon, ChevronDownIcon } from "@heroicons/vue/20/solid";

// Custom components
import FadeTransition from "../FadeTransition.vue";
// #endregion

const props = defineProps({
  options: Array,
  modelValue: String,
  label: String,
  placeholder: {
    type: String,
    default: "Select option"
  },
  type: {
    type: String,
    default: "select",
    validator: (value) => ["select", "sort"].includes(value)
  },
  id: String,
  optional: { type: Boolean, default: false }
});

const emit = defineEmits(["update:modelValue"]);

const selectedLabel = computed(() => {
  const selectedOption = props.options.filter((option) => {
    return props.modelValue === option.value;
  });

  if (selectedOption.length === 0) {
    return "";
  }

  return selectedOption[0].label;
});
</script>
<template>
  <Listbox
    :model-value="props.modelValue"
    @update:modelValue="(value) => emit('update:modelValue', value)"
  >
    <div :class="{ 'flex items-center gap-4': type === 'sort' }">
      <ListboxLabel
        v-if="label"
        :for="id"
        :class="{
          'mb-2 inline-block': type === 'select',
          'flex-shrink-0 text-xs font-normal text-grey-500': type === 'sort'
        }"
        >{{ label }}
        <span v-if="optional" class="font-normal text-grey-500">(optional)</span></ListboxLabel
      >
      <div class="relative w-full">
        <ListboxButton
          v-slot="{ open }"
          :id="id"
          :class="{
            select: type === 'select'
          }"
          class="flex items-center rounded pr-7 text-left outline-none transition-colors hover:text-grey-500 ui-focus-visible:border-black ui-focus-visible:ring-1 ui-focus-visible:ring-black"
        >
          <span v-if="selectedLabel" class="ellipse-text font-medium">{{ selectedLabel }} </span>
          <span v-else class="text-gray-500">{{ props.placeholder }}</span>
          <span
            :class="{ 'pr-2': type === 'select' }"
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center"
          >
            <ChevronDownIcon
              v-if="type === 'sort'"
              aria-hidden="true"
              class="h-5 w-5 text-grey-500 transition-transform"
              :class="{
                '-rotate-180 ': open,
                '-rotate-0 ': !open
              }"
            />
            <ChevronUpDownIcon v-else aria-hidden="true" class="h-5 w-5 text-grey-500" />
          </span>
        </ListboxButton>

        <FadeTransition>
          <ListboxOptions
            class="max-h-60 absolute z-10 mt-1 w-full overflow-auto rounded border border-grey-300 bg-white py-1 text-base shadow-md shadow-black/5 outline-none sm:text-sm"
          >
            <ListboxOption
              v-for="option in props.options"
              :key="option.value"
              v-slot="{ active, selected }"
              :value="option.value"
              as="template"
            >
              <li
                :class="{
                  ' border-black': active === true,
                  ' border-transparent': active === false,
                  'bg-grey-200': active === true && selected === false,
                  'bg-primary-400 text-white': selected === true,
                  'bg-primary-300 text-white': selected === true && active === true,
                  'text-sm': type === 'sort'
                }"
                class="cursor-pointer border-y border-dotted px-3 py-2"
              >
                <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{
                  option.label
                }}</span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </FadeTransition>
      </div>
    </div>
  </Listbox>
</template>
