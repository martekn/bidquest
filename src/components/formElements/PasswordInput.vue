<script setup>
import { ref } from "vue";
import { EyeIcon } from "@heroicons/vue/20/solid";
import { EyeSlashIcon } from "@heroicons/vue/20/solid";
const props = defineProps({
  label: { type: String, default: "" },
  modelValue: {
    type: String,
    default: ""
  },
  type: { type: String, default: "text" },
  name: { type: String },
  id: { type: String }
});

let activeType = ref(props.type);

const visibilityToggle = () => {
  activeType.value = activeType.value === "password" ? "text" : "password";
};
</script>

<template>
  <div class="input-group">
    <label :for="id">{{ label }}</label>

    <div class="w-full">
      <input
        :class="{ 'pr-8': type === 'password' }"
        :id="id"
        :name="name"
        :type="activeType"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <button
        class="absolute right-3 top-1/2 -translate-y-1/2 transform text-grey-500"
        @click="visibilityToggle"
      >
        <EyeIcon class="h-[1.25rem] w-[1.25rem]" v-if="activeType === 'password'"></EyeIcon>
        <EyeSlashIcon class="h-[1.25rem] w-[1.25rem]" v-if="activeType === 'text'"></EyeSlashIcon>
      </button>
    </div>
  </div>
</template>
