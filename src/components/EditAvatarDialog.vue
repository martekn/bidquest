<script setup>
import { ref, reactive, watch } from "vue";
import { Dialog, DialogPanel, DialogTitle, DialogDescription } from "@headlessui/vue";
import TextareaInput from "@/components/formElements/TextareaInput.vue";
import TextInput from "@/components/formElements/TextInput.vue";
import { baseAvatar } from "@/consts/baseAvatar";
import { profile } from "@/api";
import { ProfileStateManager } from "@/helper/ProfileStateManager";
import ErrorDialog from "@/components/ErrorDialog.vue";
import UserAvatar from "@/components/UserAvatar.vue";

const emit = defineEmits(["close", "avatarChange"]);

const props = defineProps({
  isOpen: { type: Boolean, default: false }
});

const panel = ref();
const isLoading = ref(false);
const apiError = reactive([]);
const urlField = ref();
const altField = ref();

const submitAvatar = async () => {
  try {
    isLoading.value = true;
    apiError.length = 0;
    const body = { avatar: { url: urlField.value, alt: altField.value } };
    if (!urlField.value) {
      body.avatar.url = baseAvatar.url;
      body.avatar.alt = baseAvatar.alt;
    }
    await profile.updateAvatar(body);

    emit("avatarChange", urlField.value, altField.value);
    emit("close");
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;
    apiError.push([...error.errors]);
  }
};

const resetField = (field, baseValue, newValue) => {
  field.value = newValue === baseValue ? "" : newValue;
};

watch(
  () => props.isOpen,
  () => {
    if (props.isOpen === true) {
      resetField(urlField, baseAvatar.url, ProfileStateManager.profile.avatar.url);
      resetField(altField, baseAvatar.alt, ProfileStateManager.profile.avatar.alt);
    }
  }
);
</script>

<template>
  <Dialog :open="isOpen" @close="$emit('close')" :initialFocus="panel" class="relative z-50">
    <div class="fixed inset-0 flex w-screen items-center justify-center">
      <div class="fixed inset-0 bg-black/75" aria-hidden="true" />
      <DialogPanel
        novalidate
        as="form"
        @submit.prevent
        ref="panel"
        class="z-10 grid w-full max-w-3xl overflow-y-auto rounded bg-white px-6 pt-6 shadow-md shadow-black/10"
      >
        <ErrorDialog v-if="apiError.length > 0" title="We could save your image" class="mb-5">
          <ul class="list-inside list-disc">
            <li v-for="[error, index] in apiError" :key="index">{{ error.message }}</li>
          </ul>
        </ErrorDialog>

        <DialogTitle class="text-semibold font-accent text-lg">Edit image</DialogTitle>
        <DialogDescription
          class="mt-2 grid grid-cols-[1fr_auto] grid-rows-[auto_1fr] gap-y-5 text-grey-500"
        >
          <TextInput v-model="urlField" label="Image url" type="url" id="url" />
          <TextareaInput v-model="altField" label="Alternative Text" id="alt" />

          <div class="col-start-2 row-span-2 row-start-1 ml-5 border-l border-grey-300 pl-5">
            <UserAvatar class="h-[15rem] w-[15rem]" :url="urlField" :alt="altField" /></div
        ></DialogDescription>

        <div class="mt-6 flex flex-row-reverse gap-6 border-t border-t-grey-300 py-4">
          <button class="button button-primary button-sm" @click="submitAvatar">Save</button>
          <button @click="$emit('close')" class="link link-secondary ml-auto">Cancel</button>
        </div>
      </DialogPanel>
    </div>
  </Dialog>
</template>
