<script setup>
import { XCircleIcon } from "@heroicons/vue/20/solid";

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
  optional: { type: Boolean, default: false }
});
</script>

<template>
  <div class="input-group" :id="'input-group-' + id">
    <label :for="id"
      >{{ label }} <span v-if="optional" class="font-normal text-grey-500">(optional)</span></label
    >

    <textarea
      :class="{ 'resize-none': !resize }"
      :id="id"
      :name="name"
      :value="modelValue"
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
