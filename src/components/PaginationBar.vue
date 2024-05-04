<script setup>
// #region -IMPORTS-
// Vue-related imports
import { reactive } from "vue";
import { RouterLink, useRoute } from "vue-router";

// Third-party library imports
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/vue/20/solid";
// #endregion

const props = defineProps({
  currentPage: { type: [Number, String, null], default: 1 },
  previousPage: { type: [Number, String, null], default: null },
  nextPage: { type: [Number, String, null], default: null },
  pageCount: { type: [Number, String], default: 1 },
  maxSlots: { type: Number, default: 7 }
});

const pages = reactive([]);
const route = useRoute();

const createPages = () => {
  pages.length = 0;
  for (let i = 0; i < props.pageCount; i++) {
    pages.push({ pageNumber: i + 1, showElement: true, displayNumber: true });
  }
};

const adjustPaginationDisplay = () => {
  if (props.pageCount > props.maxSlots) {
    const maxStart = props.maxSlots - 2;
    const maxEnd = props.pageCount - maxStart + 1;
    const isNearStart = props.currentPage < maxStart;
    const isNearEnd = props.currentPage > maxEnd;
    const isInMiddle = !isNearStart && !isNearEnd;

    for (const page of pages) {
      const { pageNumber } = page;
      const lastPage = props.pageCount;
      const firstPage = 1;

      if (pageNumber === firstPage || pageNumber === lastPage) {
        continue;
      }

      if ((isNearStart || isInMiddle) && pageNumber === lastPage - 1) {
        page.displayNumber = false;
        continue;
      }

      if ((isNearEnd || isInMiddle) && pageNumber === firstPage + 1) {
        page.displayNumber = false;
        continue;
      }

      if ((isNearStart && pageNumber > maxStart) || (isNearEnd && pageNumber < maxEnd)) {
        page.showElement = false;
      }

      if (
        isInMiddle &&
        pageNumber !== props.currentPage &&
        pageNumber !== props.currentPage - 1 &&
        pageNumber !== props.currentPage + 1
      ) {
        page.showElement = false;
      }
    }
  }
};

const setupPagination = () => {
  createPages();
  adjustPaginationDisplay();
};

setupPagination();
</script>

<template>
  <div
    class="mx-auto flex w-full max-w-sm justify-between gap-5 sm:max-w-full sm:justify-center"
    v-if="props.pageCount > 1"
  >
    <RouterLink
      :to="{
        name: route.name,
        params: { category: route.params?.category, page: `page-${previousPage}` }
      }"
      :class="{ 'invisible sm:hidden': !previousPage }"
      class="flex w-[3.5rem] items-center justify-center rounded text-black outline-none transition-all duration-150 hover:font-semibold hover:text-black hover:underline hover:underline-offset-2 focus-visible:font-semibold focus-visible:text-black focus-visible:ring-2 focus-visible:ring-black"
    >
      <ChevronLeftIcon class="h-5 w-5" /><span>Prev</span>
    </RouterLink>
    <div class="font-semibold sm:hidden">Page {{ currentPage }} of {{ pageCount }}</div>
    <ul class="hidden gap-1 sm:flex">
      <li
        v-for="{ pageNumber, showElement, displayNumber } of pages"
        :key="pageNumber"
        v-show="showElement"
      >
        <RouterLink
          v-if="displayNumber"
          :class="{
            'bg-primary-400 font-semibold text-white  hover:bg-primary-300 active:bg-primary-500':
              pageNumber === currentPage,
            ' text-grey-500 hover:font-semibold hover:text-black hover:underline hover:underline-offset-2 focus-visible:font-semibold focus-visible:text-black ':
              pageNumber !== currentPage
          }"
          class="grid h-7 w-7 place-items-center rounded outline-none transition-all duration-150 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          :to="{
            name: route.name,
            params: { category: route.params?.category, page: `page-${pageNumber}` }
          }"
          >{{ pageNumber }}
        </RouterLink>
        <span v-else class="grid h-7 w-7 place-items-center">...</span>
      </li>
    </ul>
    <RouterLink
      :to="{
        name: route.name,
        params: { category: route.params?.category, page: `page-${nextPage}` }
      }"
      :class="{ 'invisible sm:hidden': !nextPage }"
      class="flex w-[3.5rem] items-center justify-center rounded text-black outline-none transition-all duration-150 hover:font-semibold hover:text-black hover:underline hover:underline-offset-2 focus-visible:font-semibold focus-visible:text-black focus-visible:ring-2 focus-visible:ring-black"
    >
      <span>Next</span><ChevronRightIcon class="h-5 w-5" />
    </RouterLink>
  </div>
</template>
