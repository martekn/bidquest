<script setup>
// #region -IMPORTS-
// Third-party library imports
import { Notification, NotificationGroup } from "notiwind";
import {
  XCircleIcon,
  XMarkIcon,
  InformationCircleIcon,
  CheckCircleIcon
} from "@heroicons/vue/20/solid";
// #endregion

const isError = (type) => {
  return type === "error";
};
const isSuccess = (type) => {
  return type === "success";
};
</script>

<template>
  <NotificationGroup group="general">
    <div class="pointer-events-none fixed inset-0 z-50 flex items-start justify-end p-5">
      <div class="w-full max-w-sm text-black">
        <Notification
          v-slot="{ notifications, close, hovering }"
          enter="ease-out duration-300 transition"
          enter-from="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
          enter-to="translate-y-0 opacity-100 sm:translate-x-0"
          leave="transition ease-in duration-300"
          leave-from="opacity-100"
          leave-to="opacity-0"
          move="transition duration-300"
          move-delay="delay-150"
        >
          <div
            v-for="{ id, type, title, text } in notifications"
            :key="id"
            @mouseover="hovering(id, true)"
            @mouseleave="hovering(id, false)"
            :class="{
              'border-b-red-400 bg-red-300': isError(type),
              'border-b-green-400 bg-green-300': isSuccess(type),
              'border-b-black bg-grey-200': !isError(type) && !isSuccess(type)
            }"
            role="alert"
            class="pointer-events-auto mt-4 flex w-full max-w-sm items-start gap-3 overflow-hidden rounded border-b-4 p-5 shadow-md shadow-black/15"
          >
            <div>
              <XCircleIcon class="h-6 w-6 text-red-400" v-if="isError(type)" />
              <CheckCircleIcon class="h-6 w-6 text-green-400" v-if="isSuccess(type)" />
              <InformationCircleIcon
                class="h-6 w-6 text-black"
                v-if="!isError(type) && !isSuccess(type)"
              />
            </div>

            <div class="flex-1 self-center">
              <span class="font-semibold">{{ title }}</span>
              <p class="text-sm">{{ text }}</p>
            </div>
            <button
              @click="close(id)"
              class="grid h-6 w-6 place-items-center rounded outline-none transition-all duration-150 hover:text-grey-500 focus-visible:ring-2 focus-visible:ring-black"
            >
              <span class="sr-only">close</span>
              <XMarkIcon class="h-5 w-5" />
            </button>
          </div>
        </Notification>
      </div>
    </div>
  </NotificationGroup>
</template>
