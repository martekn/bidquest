<script setup>
// #region -IMPORTS-
// Custom components
import LoadingIndicator from "./LoadingIndicator.vue";
// #endregion

defineProps({
  type: { type: String, default: "submit" },
  disabled: { type: Boolean, default: false },
  buttonLoading: { type: Boolean, default: false }
});
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || buttonLoading"
    class="button button-primary"
    @click="$emit('buttonClicked')"
  >
    <span v-if="!buttonLoading"> <slot /> </span>
    <LoadingIndicator v-else color="light" />
  </button>
</template>
