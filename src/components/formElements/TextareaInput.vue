<script setup>
defineProps({
  label: { type: String, default: "" },
  modelValue: {
    type: String,
    default: ""
  },
  name: { type: String },
  id: { type: String }
});
</script>

<template>
  <div class="input-group">
    <label :for="id">{{ label }}</label>

    <textarea
      :id="id"
      :name="name"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>
