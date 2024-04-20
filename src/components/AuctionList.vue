<script setup>
// #region -IMPORTS-
// Custom components
import AuctionCard from "@/components/AuctionCard.vue";
import AuctionCardSkeleton from "@/components/skeletonLoaders/AuctionCardSkeleton.vue";
import LoadingIndicator from "@/components/LoadingIndicator.vue";
import ErrorDialog from "@/components/ErrorDialog.vue";
import EmptyState from "./EmptyState.vue";
// #endregion

defineProps({
  auctions: { type: Array, default: () => [] },
  loaded: { type: Boolean, default: false },
  loaderType: {
    type: String,
    default: "regular",
    validator: (value) => ["regular", "skeleton"].includes(value)
  },
  skeletonCount: { type: Number, default: 0 },
  displayError: { type: Boolean, default: false },
  emptyStateTitle: { type: String, default: "No auction found" },
  emptyStateText: { type: String, default: "Theres no auctions, please try again later" },
  emptyStateType: {
    type: String,
    default: "auction",
    validator: (value) => ["auction", "search"].includes(value)
  }
});
</script>

<template>
  <div>
    <div>
      <Transition
        mode="out-in"
        enter-active-class="duration-200 ease-out"
        enter-from-class="transform opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="transform opacity-0"
      >
        <ul
          v-if="loaded && !displayError && auctions.length > 0"
          class="grid gap-5 xs:grid-cols-2 md:grid-cols-4 md:gap-6"
          key="card-container"
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
        <ul
          key="skeleton-loader"
          v-else-if="!loaded && loaderType === 'skeleton'"
          class="grid gap-5 xs:grid-cols-2 md:grid-cols-4 md:gap-6"
        >
          <li v-for="n in skeletonCount" :key="n">
            <AuctionCardSkeleton />
          </li>
        </ul>
        <LoadingIndicator
          v-else-if="!loaded && loaderType === 'regular'"
          class="col-span-full mt-8 justify-center"
          color="dark"
        />
        <ErrorDialog v-else-if="displayError" title="Oops! Unable to Retrieve Auctions">
          <p>
            We're sorry, but we couldn't fetch auctions at the moment. Please ensure you have a
            stable internet connection and try refreshing the page. If the issue persists, our team
            is here to assist you. Feel free to reach out for further assistance.
          </p>
        </ErrorDialog>

        <EmptyState v-else :title="emptyStateTitle" :type="emptyStateType" :text="emptyStateText">
          <slot name="empty-state-slot" />
        </EmptyState>
      </Transition>
    </div>
    <slot name="pagination-slot" />
  </div>
</template>
