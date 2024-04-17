<script setup>
// #region -IMPORTS-
// Custom components
import AuctionCard from "@/components/AuctionCard.vue";
import AuctionCardSkeleton from "@/components/skeletonLoaders/AuctionCardSkeleton.vue";
import LoadingIndicator from "@/components/LoadingIndicator.vue";
import ErrorDialog from "@/components/ErrorDialog.vue";
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
  displayError: { type: Boolean, default: false }
});
</script>

<template>
  <div>
    <ul class="grid gap-5 xs:grid-cols-2 md:grid-cols-4 md:gap-6">
      <template v-if="!loaded && loaderType === 'skeleton'">
        <li v-for="n in skeletonCount" :key="n">
          <AuctionCardSkeleton />
        </li>
      </template>
      <template v-if="loaded">
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
      </template>
    </ul>
    <LoadingIndicator
      v-if="!loaded && loaderType === 'regular'"
      class="col-span-full mt-8 justify-center"
      color="dark"
    />
    <ErrorDialog v-if="displayError" title="Oops! Unable to Retrieve Auctions">
      <p>
        We're sorry, but we couldn't fetch auctions at the moment. Please ensure you have a stable
        internet connection and try refreshing the page. If the issue persists, our team is here to
        assist you. Feel free to reach out for further assistance.
      </p>
    </ErrorDialog>
    <slot />
  </div>
</template>
