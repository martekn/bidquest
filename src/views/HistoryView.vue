<script setup>
// #region -IMPORTS-
// Vue-related imports
import { reactive, ref, watch, computed } from "vue";
import { useRoute, RouterLink } from "vue-router";

// Third-party library imports
import dayjs from "dayjs";

// Custom module/helper imports
import { AuthStateManager } from "@/helper/AuthStateManager";
import { profile } from "@/api";
import { getCurrentBid } from "@/helper/getCurrentBid";

// Custom components
import ErrorDialog from "@/components/ErrorDialog.vue";
import EmptyState from "@/components/EmptyState.vue";
import ShowMore from "@/components/ShowMore.vue";
// #endregion

const route = useRoute();
const apiLimit = 1;

const allBids = reactive({ isLoading: true, isError: false, auctions: [] });
const allBidsMeta = ref({});

const bidsWon = reactive({ isLoading: true, isError: false, auctions: [] });
const bidsWonMeta = ref({});

const showMoreLoading = ref(false);
const showMoreError = ref(false);

const history = computed(() => {
  if (route.params.view === "wins") {
    return bidsWon.auctions;
  }

  return allBids.auctions;
});

const showButton = computed(() => {
  if (route.params.view !== "wins") {
    return !!allBidsMeta.value.nextPage;
  }

  if (route.params.view === "wins") {
    return !!bidsWonMeta.value.nextPage;
  }

  return false;
});

const showMore = async () => {
  try {
    showMoreLoading.value = true;
    showMoreError.value = false;
    if (route.params.view !== "wins") {
      resetAuctions(allBids);
      const response = await profile.getBids(apiLimit, allBidsMeta.value.nextPage);

      handleAuctionsResponse(response, allBids, allBidsMeta);
    } else {
      resetAuctions(bidsWon);
      const response = await profile.getWins(apiLimit, bidsWonMeta.value.nextPage);

      handleAuctionsResponse(response, bidsWon, bidsWonMeta);
    }
    showMoreLoading.value = false;
  } catch (error) {
    showMoreLoading.value = false;
    showMoreError.value = true;
  }
};

const resetAuctions = (auctionsObj, resetAuctions) => {
  auctionsObj.isLoading = true;
  auctionsObj.isError = false;

  if (resetAuctions) {
    auctionsObj.auctions.length = 0;
  }
};

const auctionError = (auctionsObj) => {
  auctionsObj.isError = true;
  auctionsObj.isLoading = false;
};

const handleAuctionsResponse = (response, auctionsObj, metaObj) => {
  auctionsObj.auctions.push(...response.data);
  metaObj.value = response.meta;
  auctionsObj.isLoading = false;
};

const setupHistory = async () => {
  resetAuctions(allBids, true);
  resetAuctions(bidsWon, true);

  const [allBidsResponse, bidsWonResponse] = await Promise.allSettled([
    profile.getBids(apiLimit, 1),
    profile.getWins(apiLimit, 1)
  ]);

  if (allBidsResponse.status === "fulfilled") {
    const response = { meta: allBidsResponse.value.meta };

    response.data = allBidsResponse.value.data.map((bid) => {
      return {
        date: bid.created,
        title: bid.listing.title,
        id: bid.listing.id,
        amount: bid.amount
      };
    });
    handleAuctionsResponse(response, allBids, allBidsMeta);
  } else if (allBidsResponse.status === "rejected") {
    auctionError(allBids);
  }

  if (bidsWonResponse.status === "fulfilled") {
    const response = { meta: bidsWonResponse.value.meta };
    response.data = bidsWonResponse.value.data.map((auction) => {
      return {
        date: auction.endsAt,
        title: auction.title,
        id: auction.id,
        amount: getCurrentBid(
          auction.bids.filter((bid) => bid.bidder.name === AuthStateManager.getUsername())
        )
      };
    });

    handleAuctionsResponse(response, bidsWon, bidsWonMeta, true);
  } else if (bidsWonResponse.status === "rejected") {
    auctionError(bidsWon);
  }
};

watch(
  () => route.params.username,
  () => {
    setupHistory();
  },
  { immediate: true }
);
</script>

<template>
  <main class="main-base">
    <h1>Bid history</h1>
    <div class="mt-6 flex gap-9 border-b border-b-grey-300 text-sm font-medium">
      <RouterLink
        :class="{
          ' border-b-primary-400': route.params.view !== 'wins',
          ' border-b-transparent': route.params.view === 'wins'
        }"
        class="relative -bottom-1 border-b-[3px] p-1 outline-none transition-all hover:text-grey-500 focus-visible:rounded focus-visible:ring-2 focus-visible:ring-black"
        :to="{
          name: 'history',
          params: { username: AuthStateManager.getUsername(), view: 'all' }
        }"
        >All <span class="text-grey-500">({{ allBidsMeta.totalCount ?? 0 }})</span></RouterLink
      ><RouterLink
        :class="{
          ' border-b-primary-400 ': route.params.view === 'wins',
          ' border-b-transparent ': route.params.view !== 'wins'
        }"
        class="relative -bottom-1 border-b-[3px] p-1 outline-none transition-all hover:text-grey-500 focus-visible:rounded focus-visible:ring-2 focus-visible:ring-black"
        :to="{
          name: 'history',
          params: { username: AuthStateManager.getUsername(), view: 'wins' }
        }"
        >Wins <span class="text-grey-500">({{ bidsWonMeta.totalCount ?? 0 }})</span></RouterLink
      >
    </div>
    <section class="mt-5 space-y-5 md:space-y-6">
      <template
        v-if="
          (!allBids.isError && route.params.view !== 'wins') ||
          (!bidsWon.isError && route.params.view === 'wins')
        "
      >
        <template v-if="history.length > 0">
          <table
            class="w-full border-collapse divide-y divide-grey-300 border-b border-grey-300 text-left"
          >
            <thead>
              <tr
                class="grid grid-cols-[1fr_5rem] gap-5 p-5 font-accent *:font-medium sm:grid-cols-[10rem_1fr_5rem] md:gap-7"
              >
                <th class="hidden sm:block">
                  {{ route.view !== "wins" ? "Ends" : "Ended" }}
                </th>
                <th>Bid</th>
                <th>Credit</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-grey-300">
              <tr
                v-for="auction in history"
                :key="auction.id"
                class="grid w-full grid-cols-[1fr_5rem] gap-5 p-5 *:font-medium odd:bg-grey-200 sm:grid-cols-[10rem_1fr_5rem] md:gap-7"
              >
                <td class="hidden sm:block">
                  {{ dayjs(auction.date).format("DD/MM/YYYY HH:mm") }}
                </td>
                <td>
                  <div class="flex flex-col sm:hidden">
                    <span class="font-normal text-grey-500">
                      {{ dayjs(auction.date).format("DD/MM/YYYY HH:mm") }}</span
                    >
                    <RouterLink
                      class="rounded outline-none hover:text-grey-500 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                      :to="{
                        name: 'auction',
                        params: {
                          id: auction.id
                        }
                      }"
                      >{{ auction.title }}</RouterLink
                    >
                  </div>
                  <RouterLink
                    class="hidden rounded outline-none hover:text-grey-500 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 sm:block"
                    :to="{
                      name: 'auction',
                      params: {
                        id: auction.id
                      }
                    }"
                  >
                    {{ auction.title }} hello
                  </RouterLink>
                </td>
                <td>{{ auction.amount }}</td>
              </tr>
            </tbody>
          </table>
          <ShowMore
            :show="showButton"
            :error="showMoreError"
            @loadMore="showMore"
            :loading="showMoreLoading"
            :type="route.params.view === 'wins' ? 'wins' : 'bids'"
            :visibleCount="history.length"
            :totalCount="
              route.params.view !== 'wins' ? allBidsMeta.totalCount : bidsWonMeta.totalCount
            "
          />
        </template>
        <EmptyState
          v-else
          class="mt-5"
          type="auction"
          :title="route.params.view !== 'wins' ? 'No Bids Found' : 'No Wins Found'"
          :text="`If you know you have ${route.params.view !== 'wins' ? 'bid on' : 'won'} an auction but its not displayed here, it could be that the auction has been deleted from our site`"
        >
          <RouterLink :to="{ name: 'auctions' }" class="button button-primary mt-7"
            >Explore auctions</RouterLink
          >
        </EmptyState>
      </template>
    </section>
    <ErrorDialog
      v-if="
        (route.params.view !== 'wins' && allBids.isError) ||
        (route.params.view === 'wins' && bidsWon.isError)
      "
      title="Oops! Unable to Retrieve Bids"
    >
      <p>
        We're sorry, but we couldn't fetch bids at the moment. Please ensure you have a stable
        internet connection and try refreshing the page. If the issue persists, our team is here to
        assist you. Feel free to reach out for further assistance.
      </p>
    </ErrorDialog>
  </main>
</template>
