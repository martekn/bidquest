<script setup>
// #region -IMPORTS-
// Vue-related imports
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

// Third-party library imports
import { EyeIcon, EyeSlashIcon, XCircleIcon } from "@heroicons/vue/20/solid";
// #endregion

const props = defineProps({
  label: { type: String, default: "" },
  modelValue: {
    type: String,
    default: ""
  },
  type: { type: String, default: "password" },
  name: String,
  id: String,
  isError: {
    type: Boolean,
    default: false
  },
  error: { type: String, default: "" }
});

const route = useRoute();
let activeType = ref(props.type);

const visibilityToggle = () => {
  activeType.value = activeType.value === "password" ? "text" : "password";
};

watch(
  () => route.name,
  () => {
    activeType.value = props.type;
  }
);
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
        <span v-if="activeType === 'password'" class="sr-only">Show password</span>
        <span v-if="activeType === 'text'" class="sr-only">Hide password</span>
        <EyeIcon class="h-[1.25rem] w-[1.25rem]" v-if="activeType === 'password'"></EyeIcon>
        <EyeSlashIcon class="h-[1.25rem] w-[1.25rem]" v-if="activeType === 'text'"></EyeSlashIcon>
      </button>
    </div>

    <span
      v-if="isError && error"
      class="mt-2 flex gap-2 text-sm leading-tight text-red-400"
      :id="'input-error-' + id"
      ><XCircleIcon class="h-5 w-5 flex-shrink-0 leading-tight" /> {{ error }}</span
    >
  </div>
</template>
