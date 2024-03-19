<script setup>
defineProps({
  label: { type: String, default: "" },
  modelValue: {
    type: String,
    default: ""
  },
  name: { type: String },
  id: { type: String },
  resize: { type: Boolean, default: true }
});
</script>

<template>
  <div class="input-group">
    <label :for="id">{{ label }}</label>

    <textarea
      :class="{ 'resize-none': !resize }"
      :id="id"
      :name="name"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>
