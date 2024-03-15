<script setup>
defineProps({
  label: { type: String, default: "Add image" },
  labelClasses: { type: String, default: "button button-secondary" },
  name: { type: String, default: "file-input" },
  id: { type: String, default: "file-input" },
  multiple: { type: Boolean, default: false }
});
</script>

<template>
  <div class="flex w-full items-center justify-center">
    <label :for="id" :class="labelClasses">
      {{ label }}
      <input
        :id="id"
        :name="name"
        type="file"
        @change="$emit('change', $event.target.files)"
        class="hidden"
        :multiple="multiple"
      />
    </label>
  </div>
</template>
