<script setup>
import PaginationBar from "@/components/PaginationBar.vue";
import { onMounted, computed, ref, watch, reactive } from "vue";
import { useRoute } from "vue-router";
import ListBox from "@/components/formElements/ListBox.vue";
import { getAll } from "@/api/auction/getAll";
import AuctionCard from "@/components/AuctionCard.vue";
import ErrorDialog from "@/components/ErrorDialog.vue";
import router from "@/router";
import { getByCategory } from "@/api/auction/getByCategory";
import { search } from "@/api/auction/search";
import LoadingIndicator from "@/components/LoadingIndicator.vue";

const route = useRoute();

const currentPage = ref();
const pageCount = ref();
const previousPage = ref(null);
const nextPage = ref();

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
    auctions.length = 0;
    auctionsStatus.fetchCompleted = false;
    auctionsStatus.isError = false;
    currentPage.value = getCurrentPageNumber();

    const [sortBy, sortOrder] = selectedSortOption.value.split("_");

    let response;
    if (route.name === "auctions") {
      response = await getAll(40, sortBy, sortOrder, currentPage.value);
    } else if (route.name === "category") {
      response = await getByCategory(
        route.params.category,
        40,
        sortBy,
        sortOrder,
        currentPage.value
      );
    } else if (route.name === "search") {
      response = await search(route.params.query, 40, sortBy, sortOrder, currentPage.value);
    }

    auctionsStatus.fetchCompleted = true;
    auctions.push(...response.data);

    pageCount.value = response.meta.pageCount;
    previousPage.value = response.meta.previousPage ?? null;
    nextPage.value = response.meta.nextPage ?? null;
    showSkeleton.value = false;
  } catch (error) {
    auctionsStatus.fetchCompleted = true;
    auctionsStatus.isError = true;
  }
};

watch(
  () => [route.params.page, route.name, route.params.query],
  () => {
    getAuctions();
  }
);

watch(selectedSortOption, () => {
  if (route.params && route.params.page !== "page-1") {
    router.push({ name: route.name, params: { category: route.params?.category, page: "page-1" } });
  } else {
    getAuctions();
  }
});

const showSkeleton = ref(true);

onMounted(() => {
  getAuctions();
});
</script>

<template>
  <main class="mx-auto w-full max-w-8xl px-5 pb-11 pt-6 md:pb-12 md:pt-7">
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

    <LoadingIndicator
      v-if="!auctionsStatus.fetchCompleted"
      class="col-span-full mt-8 justify-center"
      color="dark"
    />
    <ul
      v-else-if="auctionsStatus.fetchCompleted && auctionsStatus.hasAuctions"
      class="mt-5 grid gap-5 xs:grid-cols-2 md:mt-6 md:grid-cols-4 md:gap-6"
    >
      <li v-for="auction in auctions" :key="auction.id">
        <AuctionCard
          :title="auction.title"
          :id="auction.id"
          :endDate="auction.endsAt"
          :imageSrc="auction.media?.[0]?.url"
          :imageAlt="auction.media?.[0]?.alt"
          :key="auction.id"
          :bids="auction.bids"
          :auction="auction"
        />
      </li>
    </ul>
    <ErrorDialog
      v-if="auctionsStatus.isError"
      title="Oops! Unable to Retrieve Ending Soon Auctions"
    >
      We're sorry, but we couldn't fetch auctions ending soon at the moment. Please ensure you have
      a stable internet connection and try refreshing the page. If the issue persists, our team is
      here to assist you. Feel free to reach out for further assistance.
    </ErrorDialog>
    <ErrorDialog
      v-if="!auctionsStatus.hasAuctions && !auctionsStatus.isError"
      title="No Auctions Found"
      state="info"
    >
      We're sorry, but it seems that there are currently no auctions available at the moment. Our
      inventory is constantly being updated, so please check back later for new listings. In the
      meantime, feel free to explore other sections of our platform or reach out to our customer
      support team if you have any questions or concerns. Thank you for your patience and
      understanding.
    </ErrorDialog>
    <PaginationBar
      :currentPage="currentPage"
      :previousPage="previousPage"
      :nextPage="nextPage"
      :pageCount="pageCount"
      class="my-7 self-center"
    ></PaginationBar>
  </main>
</template>
