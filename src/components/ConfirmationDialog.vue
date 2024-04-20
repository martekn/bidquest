<script setup>
// #region -IMPORTS-
// Vue-related imports
import { ref } from "vue";

// Third-party library imports
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogDescription,
  TransitionChild,
  TransitionRoot
} from "@headlessui/vue";
// #endregion

defineProps({
  isOpen: { type: Boolean, default: false },
  title: { type: String, default: "Are you sure?" },

  ctaText: { type: String, default: "Delete" }
});

const panel = ref();
</script>

<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog :open="isOpen" @close="$emit('close')" :initialFocus="panel" class="relative z-50">
      <div class="fixed inset-0 flex w-screen items-center justify-center">
        <TransitionChild
          as="template"
          enter="ease-out duration-200"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-100"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/75" aria-hidden="true" />
        </TransitionChild>

        <TransitionChild
          as="template"
          enter="ease-out duration-200"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 translate-y-0 scale-100"
          leave="ease-in duration-100"
          leave-from="opacity-100 translate-y-0 scale-100"
          leave-to="opacity-0 scale-95"
        >
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
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
