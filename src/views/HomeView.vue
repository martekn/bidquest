<script setup>
import { onMounted, reactive, ref } from "vue";
import { RouterLink } from "vue-router";
import { auction } from "@/api";
import AuctionCard from "@/components/AuctionCard.vue";
import AuctionCardSkeleton from "@/components//skeletonLoaders/AuctionCardSkeleton.vue";
import ErrorDialog from "@/components/ErrorDialog.vue";

const auctionsEndingSoon = reactive([]);
const newestAuctions = reactive([]);
const auctionsEndingSoonError = ref(false);
const newestAuctionsError = ref(false);
const isAuctionsEndingSoonLoading = ref(true);
const isNewestAuctionsLoading = ref(true);
const getAuctionsEndingSoon = async () => {
  try {
    const response = await auction.getAll(4, "endsAt", "asc");
    auctionsEndingSoon.push(...response.data);
  } catch (error) {
    auctionsEndingSoonError.value = true;
  } finally {
    isAuctionsEndingSoonLoading.value = false;
  }
};

const getNewestAuctions = async () => {
  try {
    const response = await auction.getAll(8, "created", "desc");
    newestAuctions.push(...response.data);
  } catch (error) {
    newestAuctionsError.value = true;
  } finally {
    isNewestAuctionsLoading.value = false;
  }
};

onMounted(() => {
  getAuctionsEndingSoon();
  getNewestAuctions();
});
</script>

<template>
  <main class="space-y-9 pb-11 md:space-y-10 md:pb-12">
    <section class="hidden bg-straws-pattern">
      <div class="mx-auto max-w-8xl px-5 pb-10 pt-12 md:pb-12">
        <h1 class="font-accent text-5xl font-semibold leading-tight md:text-6xl">
          Auctions Made Simple.
        </h1>
        <p class="mt-3 max-w-xl font-medium text-grey-500 md:mt-2">
          We've simplified the auction experience. Whether you're hunting for unique treasures or
          decluttering your home. Browse, bid, and win items from various categories or list your
          own items.
        </p>
        <div class="mt-7 grid w-fit grid-cols-2 gap-5 md:gap-6">
          <RouterLink to="/auctions" class="button button-primary block">Explore</RouterLink
          ><RouterLink to="/auction" class="button button-secondary block">Create</RouterLink>
        </div>
      </div>

      <div class="bg-black text-white">
        <p class="mx-auto max-w-8xl px-5 py-4 font-semibold">
          New members receive a bonus of 1000 welcome credits upon signing up!
        </p>
      </div>
    </section>

    <section class="mx-auto max-w-8xl px-5">
      <h2>Auctions ending soon</h2>
      <ul
        class="mt-5 grid gap-5 xs:grid-cols-2 md:mt-6 md:grid-cols-4 md:gap-6"
        v-if="!auctionsEndingSoonError"
      >
        <template v-if="!isAuctionsEndingSoonLoading">
          <li v-for="auction in auctionsEndingSoon" :key="'ending-' + auction.id">
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
        </template>
        <template v-else>
          <li v-for="n in 4" :key="n">
            <AuctionCardSkeleton />
          </li>
        </template>
      </ul>
      <ErrorDialog
        class="mt-5 md:mt-6"
        v-else
        title="Oops! Unable to Retrieve Ending Soon Auctions"
      >
        We're sorry, but we couldn't fetch auctions ending soon at the moment. Please ensure you
        have a stable internet connection and try refreshing the page. If the issue persists, our
        team is here to assist you. Feel free to reach out for further assistance.
      </ErrorDialog>
    </section>

    <section class="mx-auto max-w-8xl px-5">
      <h2>Newest auctions</h2>
      <ul
        class="mt-5 grid gap-5 xs:grid-cols-2 md:mt-6 md:grid-cols-4 md:gap-6"
        v-if="!newestAuctionsError"
      >
        <template v-if="!isNewestAuctionsLoading">
          <li v-for="auction in newestAuctions" :key="'ending-' + auction.id">
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
        </template>
        <template v-else>
          <li v-for="n in 8" :key="n">
            <AuctionCardSkeleton />
          </li>
        </template>
      </ul>

      <ErrorDialog class="mt-5 md:mt-6" v-else title="Uh-oh! Can't Retrieve Newest Auctions">
        We're sorry, but we're currently experiencing difficulties retrieving the newest auctions.
        Please check your internet connection and try refreshing the page. If the problem persists,
        our support team is available to help. Don't hesitate to contact us for assistance.
      </ErrorDialog>
    </section>
  </main>
</template>
