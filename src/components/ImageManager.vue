<script setup>
// #region -IMPORTS-
// Custom module/helper imports
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/vue/20/solid";

// Custom components
import TextareaInput from "@/components/formElements/TextareaInput.vue";
// #endregion

defineProps({
  images: {
    type: Array,
    default: () => []
  }
});
</script>

<template>
  <div>
    <ul class="flex flex-col divide-y divide-grey-300">
      <li
        v-for="(image, index) in images"
        :key="image.id"
        class="flex flex-col gap-5 py-7 xs:flex-row"
      >
        <div class="relative w-full xs:w-[300px]">
          <div class="aspect-h-3 aspect-w-4 h-full w-full">
            <img
              class="rounded object-cover"
              :src="image.url"
              onerror="this.onerror=null;this.src='/image-placeholder.jpg';"
            />
          </div>
        </div>
        <div class="grid w-full grid-rows-[1fr_auto] gap-3">
          <TextareaInput
            :resize="false"
            label="Image description"
            v-model="image.alt"
            class="col-span-2 w-full"
            :maxCount="120"
            counter-location="top"
          ></TextareaInput>
          <div class="flex gap-3">
            <button
              :disabled="index === images.length - 1"
              class="grid min-h-[30px] min-w-[30px] place-items-center rounded border border-black/10 bg-grey-300 text-black/80 outline-none hover:bg-grey-300/80 hover:text-black hover:shadow-sm focus-visible:ring-2 focus-visible:ring-black active:bg-grey-400/50 disabled:pointer-events-none disabled:border-transparent disabled:bg-grey-300/50 disabled:text-grey-500/50 disabled:shadow-none disabled:transition-none"
              @click="$emit('moveDown', index)"
            >
              <span class="sr-only">Move image up</span>
              <ChevronDownIcon class="h-6 w-6" />
            </button>
            <button
              :disabled="index === 0"
              class="grid min-h-[30px] min-w-[30px] place-items-center rounded border border-black/10 bg-grey-300 text-black/80 outline-none hover:bg-grey-300/80 hover:text-black hover:shadow-sm focus-visible:ring-2 focus-visible:ring-black active:bg-grey-400/50 disabled:pointer-events-none disabled:border-transparent disabled:bg-grey-300/50 disabled:text-grey-500/50 disabled:shadow-none disabled:transition-none"
              @click="$emit('moveUp', index)"
            >
              <span class="sr-only">Move image down</span>
              <ChevronUpIcon class="h-6 w-6" />
            </button>
          </div>
          <button
            class="justify-self-end rounded p-1 font-semibold text-red-400 outline-none transition-all duration-150 hover:underline focus-visible:ring-2 focus-visible:ring-black active:text-red-400/70"
            @click="$emit('delete', index)"
          >
            Delete
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>
