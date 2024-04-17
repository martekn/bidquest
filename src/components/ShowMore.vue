<script setup>
// #region -IMPORTS-
// Third-party library imports
import { ChevronDownIcon } from "@heroicons/vue/20/solid";

// Custom components
import LoadingIndicator from "./LoadingIndicator.vue";
// #endregion

defineProps({
  error: { type: Boolean, default: false },
  show: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  visibleCount: { type: Number, default: 0 },
  totalCount: { type: Number, default: 0 },
  type: { type: String, default: "bids" }
});
</script>

<template>
  <div class="grid place-items-center">
    <span
      class="mt-5 block border-b-grey-300 px-3 pb-3 text-xs text-grey-500"
      :class="{ 'border-b': show }"
      >Showing {{ visibleCount }} of
      {{ totalCount }}
      {{ type }}</span
    >

    <div v-if="show">
      <LoadingIndicator color="primary" class="mt-5" v-if="loading" />
      <button v-else @click="$emit('loadMore')" class="button button-primary mt-5">
        <span class="flex items-center justify-between gap-5"
          ><span class="flex-shrink-0">Show more</span> <ChevronDownIcon class="h-6 w-6"
        /></span>
      </button>
    </div>

    <div v-if="error" class="mt-5">
      <p class="max-w-[35ch] text-center text-red-400">
        There was an error getting more results, please try again.
      </p>
    </div>
  </div>
</template>
