<script setup>
// #region -IMPORTS-
// Vue-related imports
import { onMounted, computed, ref, watch, reactive } from "vue";
import { useRoute } from "vue-router";
import router from "@/router";

// Custom module/helper imports
import { auction } from "@/api";

// Custom components
import PaginationBar from "@/components/PaginationBar.vue";
import ListBox from "@/components/formElements/ListBox.vue";
import AuctionList from "@/components/AuctionList.vue";
// #endregion

const emptyStateMessage = () => {
  if (route.view === "category") {
    return "Theres no auctions in this category, please try again later";
  } else if (route.view === "search") {
    return "Theres no auctions for this search";
  } else {
    return "Theres no auctions, please try again later";
  }
};
const route = useRoute();

const currentPage = ref();
const pageCount = ref();
const previousPage = ref(null);
const nextPage = ref();
const showList = ref(true);
const showPagination = ref(false);

const auctions = reactive([]);
const auctionsStatus = reactive({
  fetchCompleted: false,
  hasAuctions: computed(() => auctions.length > 0),
  isError: false
});

const sortOptions = [
  { value: "endsAt_asc", label: "Ending Soon" },
  { value: "created_desc", label: "Latest Added" }
];

const selectedSortOption = ref(sortOptions[0].value);

const getCurrentPageNumber = () => {
  let pageNumber = 1;
  if (route.params && route.params.page) {
    pageNumber = Number(route.params.page.replace("page-", ""));
  }
  return pageNumber;
};

const getAuctions = async () => {
  try {
    showPagination.value = false;
    auctions.length = 0;
    auctionsStatus.fetchCompleted = false;
    auctionsStatus.isError = false;
    currentPage.value = getCurrentPageNumber();
    showList.value = true;

    const [sortBy, sortOrder] = selectedSortOption.value.split("_");

    let response;
    if (route.name === "auctions") {
      response = await auction.getAll(40, sortBy, sortOrder, currentPage.value);
    } else if (route.name === "category") {
      response = await auction.getByCategory(
        route.params.category,
        40,
        sortBy,
        sortOrder,
        currentPage.value
      );
    } else if (route.name === "search") {
      response = await auction.search(route.params.query, 40, sortBy, sortOrder, currentPage.value);
    }

    auctionsStatus.fetchCompleted = true;
    auctions.push(...response.data);

    pageCount.value = response.meta.pageCount;
    previousPage.value = response.meta.previousPage ?? null;
    nextPage.value = response.meta.nextPage ?? null;
    setTimeout(() => {
      showPagination.value = auctionsStatus.hasAuctions;
    }, 200);
  } catch (error) {
    auctionsStatus.fetchCompleted = true;
    auctionsStatus.isError = true;
  }
};

watch(
  () => [route.params.page, route.name, route.params.query],
  () => {
    showList.value = false;

    // The timeout is to make sure the scroll happens properly before page loads auctions
    setTimeout(() => {
      getAuctions();
    }, 100);
  }
);

watch(selectedSortOption, () => {
  if (route.params && route.params.page !== "page-1") {
    router.push({ name: route.name, params: { category: route.params?.category, page: "page-1" } });
  } else {
    getAuctions();
  }
});

onMounted(() => {
  getAuctions();
});
</script>

<template>
  <main class="main-base">
    <div class="flex flex-wrap items-end justify-between gap-5">
      <h1 class="first-letter:capitalize">
        <template v-if="route.name === 'search'"
          >Search results for {{ route.params.query }}</template
        >
        <template v-else-if="route.name === 'category'">{{ route.params.category }}</template>
        <template v-else>Auctions</template>
      </h1>

      <ListBox
        v-if="auctionsStatus.fetchCompleted && auctionsStatus.hasAuctions"
        placeholder="Select sort by"
        v-model="selectedSortOption"
        :options="sortOptions"
        type="sort"
        label="Sort by"
        id="sort"
        class="w-[12rem]"
      />
    </div>

    <AuctionList
      v-if="showList"
      class="mt-5 md:mt-6"
      :auctions="auctions"
      :loaded="auctionsStatus.fetchCompleted"
      loaderType="regular"
      :displayError="auctionsStatus.isError"
      :emptyStateType="route.name === 'search' ? 'search' : 'auction'"
      emptyStateTitle="No auctions found"
      :emptyStateText="emptyStateMessage()"
    >
      <template #pagination-slot>
        <PaginationBar
          v-if="showPagination"
          :currentPage="currentPage"
          :previousPage="previousPage"
          :nextPage="nextPage"
          :pageCount="pageCount"
          class="my-7 self-center"
        ></PaginationBar>
      </template>
    </AuctionList>
  </main>
</template>
