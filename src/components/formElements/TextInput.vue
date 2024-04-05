<script setup>
import { XCircleIcon } from "@heroicons/vue/20/solid";

defineProps({
  label: { type: String, default: "" },
  modelValue: {
    type: String,
    default: ""
  },
  type: { type: String, default: "text" },
  name: { type: String },
  id: { type: String },
  isError: {
    type: Boolean,
    default: false
  },
  error: { type: String, default: "" }
});
</script>

<template>
  <div class="input-group" :id="'input-group-' + id">
    <label :for="id">{{ label }}</label>

    <input
      :class="{
        error: isError
      }"
      :id="id"
      :name="name"
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <span
      v-if="isError && error"
      class="flex gap-2 text-sm leading-tight text-red-400"
      :id="'input-error-' + id"
      ><XCircleIcon class="h-5 w-5 flex-shrink-0 leading-tight" /> {{ error }}</span
    >
  </div>
</template>
