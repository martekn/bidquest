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
  name: { type: String },
  id: { type: String },
  resize: { type: Boolean, default: true },
  isError: {
    type: Boolean,
    default: false
  },
  error: { type: String, default: "" },
  optional: { type: Boolean, default: false },
  maxCount: Number,
  counterLocation: {
    type: String,
    default: "bottom",
    validator: (value) => ["top", "bottom"].includes(value)
  }
});
</script>

<template>
  <div class="input-group" :id="'input-group-' + id">
    <div class="flex items-end justify-between gap-5">
      <label :for="id"
        >{{ label }}
        <span v-if="optional" class="font-normal text-grey-500">(optional)</span></label
      >
      <span
        class="mb-2 ml-auto text-sm leading-tight text-grey-500"
        v-if="maxCount && counterLocation === 'top'"
        >{{ modelValue.length }}/{{ maxCount }}</span
      >
    </div>

    <textarea
      class="flex-grow"
      :MaxLength="maxCount"
      :class="{ 'resize-none': !resize }"
      :id="id"
      :name="name"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />

    <div class="mt-2 flex justify-between gap-5 text-sm leading-tight">
      <span v-if="isError && error" class="flex gap-2 text-red-400" :id="'input-error-' + id"
        ><XCircleIcon class="h-5 w-5 flex-shrink-0 leading-tight" /> {{ error }}</span
      >
      <span
        class="ml-auto text-sm leading-tight text-grey-500"
        v-if="maxCount && counterLocation === 'bottom'"
        >{{ modelValue.length }}/{{ maxCount }}</span
      >
    </div>
  </div>
</template>
