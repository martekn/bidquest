<script setup>
// #region -IMPORTS-
// Vue-related imports
import { ref, reactive, watch } from "vue";

// Third-party library imports
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogDescription,
  TransitionChild,
  TransitionRoot
} from "@headlessui/vue";

// Custom module/helper imports
import { profile } from "@/api";
import { ProfileStateManager } from "@/helper/ProfileStateManager";

// Constants imports
import { baseAvatar } from "@/consts/baseAvatar";

// Custom components
import TextareaInput from "@/components/formElements/TextareaInput.vue";
import TextInput from "@/components/formElements/TextInput.vue";
import ErrorDialog from "@/components/ErrorDialog.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import LoadingButton from "./LoadingButton.vue";
// #endregion

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
            novalidate
            as="form"
            @submit.prevent
            ref="panel"
            class="z-10 grid max-h-[100svh] w-full max-w-3xl overflow-y-auto rounded bg-white px-6 pt-6 shadow-md shadow-black/10"
          >
            <ErrorDialog v-if="apiError.length > 0" title="We could save your image" class="mb-5">
              <ul class="list-inside list-disc">
                <li v-for="[error, index] in apiError" :key="index">{{ error.message }}</li>
              </ul>
            </ErrorDialog>

            <DialogTitle class="text-semibold font-accent text-lg">Edit image</DialogTitle>
            <DialogDescription
              class="mt-4 grid gap-y-5 text-grey-500 min-[35em]:grid-cols-[1fr_auto] min-[35em]:grid-rows-[auto_1fr]"
            >
              <TextInput v-model="urlField" label="Image url" type="url" id="url" />
              <TextareaInput
                class="min-h-[9rem]"
                v-model="altField"
                label="Alternative Text"
                id="alt"
                :maxCount="120"
                counter-location="bottom"
                resize
              />

              <div
                class="row-start-1 justify-self-center border-grey-300 max-[35em]:aspect-h-1 max-[35em]:aspect-w-1 max-[35em]:w-full min-[35em]:col-start-2 min-[35em]:row-span-2 min-[35em]:row-start-1 min-[35em]:ml-5 min-[35em]:border-l min-[35em]:pl-5"
              >
                <div>
                  <UserAvatar
                    class="h-full w-full min-[35em]:h-[15rem] min-[35em]:w-[15rem]"
                    :url="urlField"
                    :alt="altField"
                  />
                </div>
              </div>
            </DialogDescription>

            <div class="mt-6 flex flex-row-reverse gap-6 border-t border-grey-300 py-4">
              <LoadingButton @buttonClicked="submitAvatar" :buttonLoading="isLoading"
                >Save</LoadingButton
              >
              <button @click="$emit('close')" class="link link-secondary ml-auto">Cancel</button>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
