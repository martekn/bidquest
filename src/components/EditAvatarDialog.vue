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
import { debounce } from "@/helper/debounce";

// Custom components
import TextareaInput from "@/components/formElements/TextareaInput.vue";
import TextInput from "@/components/formElements/TextInput.vue";
import ErrorDialog from "@/components/ErrorDialog.vue";
import LoadingButton from "@/components/LoadingButton.vue";
import LoadingIndicator from "@/components/LoadingIndicator.vue";
import FadeTransition from "@/components/FadeTransition.vue";

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
const previewImage = ref();
const previewLoading = ref(true);
const previewError = ref(false);

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

const loadNewPreview = debounce(async () => {
  try {
    const response = await fetch(urlField.value, { method: "HEAD" });
    if (!response.headers.get("Content-Type").startsWith("image")) {
      throw Error("Url is not an image");
    }
    previewImage.value = urlField.value;
  } catch (error) {
    previewImage.value = "/image-placeholder.jpg";
    previewError.value = true;
  }
  previewLoading.value = false;
}, 500);

watch(
  () => props.isOpen,
  () => {
    if (props.isOpen === true) {
      previewError.value = false;
      resetField(urlField, baseAvatar.url, ProfileStateManager.profile.avatar.url);
      resetField(previewImage, baseAvatar.url, ProfileStateManager.profile.avatar.url);
      resetField(altField, baseAvatar.alt, ProfileStateManager.profile.avatar.alt);
      previewLoading.value = false;
    }
  }
);

watch(
  () => urlField.value,
  () => {
    previewLoading.value = true;
    previewError.value = false;
    if (!urlField.value) {
      previewImage.value = "/avatar-placeholder.jpg";
      previewLoading.value = false;
      return;
    } else {
      loadNewPreview();
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
                <div
                  class="image-border-overlay grid max-h-full w-full place-items-center rounded bg-grey-300 min-[35em]:h-[15rem] min-[35em]:w-[15rem]"
                >
                  <FadeTransition mode="out-in">
                    <LoadingIndicator color="dark" v-if="previewLoading" />
                    <span v-else-if="previewError">Invalid image url</span>
                    <img
                      v-else
                      :src="previewImage"
                      :alt="altField"
                      class="max-h-full w-full overflow-hidden rounded object-cover"
                    />
                  </FadeTransition>
                </div>
              </div>
            </DialogDescription>

            <div class="mt-6 flex flex-row-reverse gap-6 border-t border-grey-300 py-4">
              <LoadingButton
                @buttonClicked="submitAvatar"
                :buttonLoading="isLoading"
                :disabled="previewError || previewLoading"
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
