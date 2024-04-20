<script setup>
// #region -IMPORTS-
// Vue-related imports
import { ref } from "vue";

// Third-party library imports
import { Dialog, DialogPanel, DialogTitle, DialogDescription } from "@headlessui/vue";
// #endregion

defineProps({
  isOpen: { type: Boolean, default: false },
  title: { type: String, default: "Are you sure?" },

  ctaText: { type: String, default: "Delete" }
});

const panel = ref();
</script>

<template>
  <Dialog :open="isOpen" @close="$emit('close')" :initialFocus="panel" class="relative z-50">
    <div class="fixed inset-0 flex w-screen items-center justify-center">
      <div class="fixed inset-0 bg-black/75" aria-hidden="true" />
      <DialogPanel
        ref="panel"
        class="z-10 grid max-h-[100svh] w-full max-w-lg overflow-y-auto rounded bg-white px-6 pt-6 shadow-md shadow-black/10"
      >
        <DialogTitle class="text-semibold font-accent text-lg">{{ title }}</DialogTitle>
        <DialogDescription class="mt-2 text-grey-500"> <slot /></DialogDescription>

        <div class="mt-6 flex flex-row-reverse gap-6 border-t border-t-grey-300 py-4">
          <button class="button button-primary button-sm" @click="$emit('confirm')">
            {{ ctaText }}
          </button>
          <button @click="$emit('close')" class="link link-secondary ml-auto">Cancel</button>
        </div>
      </DialogPanel>
    </div>
  </Dialog>
</template>
