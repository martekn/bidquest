<script setup>
// #region -IMPORTS-
// Third-party library imports
import { XCircleIcon } from "@heroicons/vue/20/solid";
// #endregion

defineProps({
  label: { type: String, default: "" },
  modelValue: {
    type: String,
    default: ""
  },
  type: { type: String, default: "text" },
  name: String,
  id: String,
  isError: {
    type: Boolean,
    default: false
  },
  error: { type: String, default: "" },
  hiddenLabel: { type: Boolean, default: false },
  placeholder: { type: String, default: "" },
  min: String,
  max: String,
  optional: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
});
</script>

<template>
  <div class="input-group" :id="'input-group-' + id">
    <label :class="{ 'sr-only': hiddenLabel }" :for="id"
      >{{ label }} <span v-if="optional" class="font-normal text-grey-500">(optional)</span></label
    >

    <input
      :class="{
        error: isError,
        'text-center': type === 'time'
      }"
      :id="id"
      :name="name"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :min="min"
      :max="max"
      :disabled="disabled"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <span
      v-if="isError && error"
      class="mt-2 flex gap-2 text-sm leading-tight text-red-400"
      :id="'input-error-' + id"
      ><XCircleIcon class="h-5 w-5 flex-shrink-0 leading-tight" /> {{ error }}</span
    >
  </div>
</template>
