<script setup>
import { ref } from "vue";
import { EyeIcon } from "@heroicons/vue/20/solid";
import { EyeSlashIcon } from "@heroicons/vue/20/solid";
import { XCircleIcon } from "@heroicons/vue/20/solid";
const props = defineProps({
  label: { type: String, default: "" },
  modelValue: {
    type: String,
    default: ""
  },
  type: { type: String, default: "password" },
  name: { type: String },
  id: { type: String },
  isError: {
    type: Boolean,
    default: false
  },
  error: { type: String, default: "" }
});

let activeType = ref(props.type);

const visibilityToggle = () => {
  activeType.value = activeType.value === "password" ? "text" : "password";
};
</script>

<template>
  <div class="input-group" :id="'input-group-' + id">
    <label :for="id">{{ label }}</label>

    <div class="relative w-full">
      <input
        :class="{
          'pr-8': type === 'password',

          error: isError
        }"
        :id="id"
        :name="name"
        :type="activeType"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <button
        type="button"
        class="absolute right-3 top-1/2 -translate-y-1/2 transform rounded text-grey-500 outline-none transition-all hover:text-black/90 focus-visible:text-black focus-visible:ring-2 focus-visible:ring-black"
        @click="visibilityToggle"
      >
        <EyeIcon class="h-[1.25rem] w-[1.25rem]" v-if="activeType === 'password'"></EyeIcon>
        <EyeSlashIcon class="h-[1.25rem] w-[1.25rem]" v-if="activeType === 'text'"></EyeSlashIcon>
      </button>
    </div>

    <span
      v-if="isError && error"
      class="flex gap-2 text-sm leading-tight text-red-400"
      :id="'input-error-' + id"
      ><XCircleIcon class="h-5 w-5 flex-shrink-0 leading-tight" /> {{ error }}</span
    >
  </div>
</template>
