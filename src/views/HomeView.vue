<script setup>
// #region -IMPORTS-
// Vue-related imports
import { onMounted, reactive, ref } from "vue";
import { RouterLink } from "vue-router";

// Custom module/helper imports
import { auction } from "@/api";

// Custom components
import AuctionList from "@/components/AuctionList.vue";
import EmptyState from "@/components/EmptyState.vue";
// #endregion

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
    <section class="bg-straws-pattern">
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
          <RouterLink :to="{ name: 'auctions' }" class="button button-primary block"
            >Explore</RouterLink
          ><RouterLink :to="{ name: 'create' }" class="button button-secondary block"
            >Create</RouterLink
          >
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
      <AuctionList
        class="mt-5 md:mt-6"
        :auctions="auctionsEndingSoon"
        :loaded="!isAuctionsEndingSoonLoading"
        loaderType="skeleton"
        :skeletonCount="4"
        :displayError="auctionsEndingSoonError"
      >
        <EmptyState
          v-if="
            auctionsEndingSoon.length === 0 &&
            !isAuctionsEndingSoonLoading &&
            !auctionsEndingSoonError
          "
          type="auction"
          title="No auctions found"
          text="Theres no auctions ending soon at the moment, please try again later"
        />
      </AuctionList>
    </section>

    <section class="mx-auto max-w-8xl px-5">
      <h2>Newest auctions</h2>
      <AuctionList
        class="mt-5 md:mt-6"
        :auctions="newestAuctions"
        :loaded="!isNewestAuctionsLoading"
        loaderType="skeleton"
        :skeletonCount="4"
        :displayError="newestAuctionsError"
      >
        <EmptyState
          v-if="newestAuctions.length === 0 && !isNewestAuctionsLoading && !newestAuctionsError"
          type="auction"
          title="No auctions found"
          text="Theres no new auctions at the moment, please try again later"
        />
      </AuctionList>
    </section>
  </main>
</template>
