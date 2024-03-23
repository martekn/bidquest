<script setup>
defineProps({
  label: { type: String, default: "" },
  modelValue: {
    type: String,
    default: ""
  },
  type: { type: String, default: "text" },
  name: { type: String },
  id: { type: String }
});
</script>

<template>
  <div class="input-group">
    <label :for="id">{{ label }}</label>

    <input
      :id="id"
      :name="name"
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>
