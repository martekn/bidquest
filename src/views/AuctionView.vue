<script setup>
// #region -IMPORTS-
// Vue-related imports
import { onMounted, reactive, ref, watch } from "vue";
import { useRoute, RouterLink } from "vue-router";

// Custom module/helper imports
import { auction } from "@/api";
import { nanoid } from "@/helper/nanoid";

// Custom components
import NotFoundView from "./NotFoundView.vue";
import AuctionBid from "@/components/AuctionBid.vue";
import MediaGallery from "@/components/mediaGallery/MediaGallery.vue";
import LoadingIndicator from "@/components/LoadingIndicator.vue";
import ErrorDialog from "@/components/ErrorDialog.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import AuctionList from "@/components/AuctionList.vue";
// #endregion

const isLoadingAuction = ref(true);
const auctionError = ref(false);
const isInvalidId = ref(false);
let auctionDetail = ref({});

let featuredAuctions = reactive([]);
const isLoadingFeaturedAuctions = ref(true);
const featuredAuctionsError = ref(false);
const route = useRoute();

const setMediaArray = (media) => {
  const newMedia = [...media];
  if (newMedia.length === 0) {
    newMedia.push({
      url: "/image-placeholder.jpg",
      alt: "Placeholder image",
      id: "placeholder"
    });
  }

  for (const media of newMedia) {
    if (!media.id) {
      media.id = nanoid();
    }
  }
  return newMedia;
};

const getFeaturedAuctions = (id, auctions) => {
  const filteredAuctions = auctions.filter((auction) => auction.id !== id);
  const shuffledAuctions = filteredAuctions.sort(() => 0.5 - Math.random());
  return shuffledAuctions.slice(0, 4);
};

const getAuctions = async () => {
  const [singleAuction, auctions] = await Promise.allSettled([
    auction.getSingle(route.params.id),
    auction.getAll(40, "id", "asc")
  ]);

  if (singleAuction.status === "fulfilled") {
    document.title = `${singleAuction.value.data.title} | BidQuest`;
    singleAuction.value.data.media = setMediaArray(singleAuction.value.data.media);
    auctionDetail.value = singleAuction.value.data;
    isLoadingAuction.value = false;
  } else if (singleAuction.status === "rejected") {
    if (
      singleAuction.reason.errors[0].code === "invalid_string" ||
      singleAuction.reason.statusCode === 404
    ) {
      isInvalidId.value = true;
    }
    auctionError.value = true;
    isLoadingAuction.value = false;
    isLoadingAuction.value = false;
  }

  if (auctions.status === "fulfilled" && singleAuction.status === "fulfilled") {
    featuredAuctions = getFeaturedAuctions(singleAuction.value.data.id, auctions.value.data);
    isLoadingFeaturedAuctions.value = false;
  } else if (auctions.status === "rejected" || singleAuction.status === "rejected") {
    featuredAuctionsError.value = true;
    isLoadingFeaturedAuctions.value = false;
  }
};

const updateAuction = async () => {
  try {
    const singleAuction = await auction.getSingle(route.params.id);
    auctionDetail.value = singleAuction.data;
  } catch (error) {
    if (error.errors[0].code === "invalid_string") {
      isInvalidId.value = true;
      return;
    }
    window.location.reload();
  }
};

onMounted(() => {
  watch(
    () => route.params.id,
    async () => {
      isLoadingAuction.value = true;
      auctionError.value = false;
      isLoadingFeaturedAuctions.value = true;
      featuredAuctionsError.value = false;
      getAuctions();
    },
    { immediate: true }
  );
});
</script>

<template>
  <NotFoundView v-if="isInvalidId"></NotFoundView>
  <main v-else class="main-base">
    <template v-if="isLoadingAuction"><LoadingIndicator color="dark" /></template>
    <section v-if="!isLoadingAuction">
      <div v-if="!auctionError" class="grid gap-7 md:grid-cols-12 md:gap-7">
        <MediaGallery
          :images="auctionDetail.media"
          class="md:col-span-7 md:col-start-1 md:row-start-1"
        ></MediaGallery>
        <div class="md:col-span-7">
          <h1 class="overflow-wrap-anywhere">{{ auctionDetail.title }}</h1>
          <p class="overflow-wrap-anywhere mt-5">{{ auctionDetail.description }}</p>
          <div class="mt-6 flex items-center gap-3 text-sm">
            <span class="text-grey-500">Auction brought to you by</span>
            <RouterLink
              :to="{ name: 'profile', params: { username: auctionDetail.seller.name } }"
              class="flex items-center gap-2 outline-none transition-all hover:text-grey-500 focus-visible:underline"
            >
              <UserAvatar
                class="h-6 w-6"
                :url="auctionDetail.seller.avatar.url"
                :alt="auctionDetail.seller.avatar.alt"
              />
              <span class="font-medium">{{ auctionDetail.seller.name }}</span>
            </RouterLink>
          </div>
        </div>
        <AuctionBid
          class="border-t border-t-grey-300 pt-7 md:col-span-5 md:row-span-2 md:row-start-1 md:border-t-0 md:pt-0"
          :endsAt="auctionDetail.endsAt"
          :updatedAt="auctionDetail.updated"
          :createdAt="auctionDetail.created"
          :seller="auctionDetail.seller.name"
          :bids="auctionDetail.bids"
          :id="auctionDetail.id"
          @bid="updateAuction"
        ></AuctionBid>
      </div>
      <template v-else
        ><ErrorDialog title="Uh-oh! Unable to Retrieve Auction Details" id="auction-error"
          ><p>
            We apologize for the inconvenience, but we're currently unable to fetch the details of
            this auction. Please ensure you have a stable internet connection and try refreshing the
            page. If the issue persists, don't hesitate to contact our support team for assistance.
            Thank you for your patience and understanding.
          </p></ErrorDialog
        ></template
      >
    </section>

    <section v-if="!isLoadingFeaturedAuctions && !featuredAuctionsError" class="mt-10">
      <h2>Randomized Auction Highlights</h2>
      <AuctionList
        class="mt-5 md:mt-6"
        :auctions="featuredAuctions"
        :loaded="!isLoadingFeaturedAuctions"
        loaderType="skeleton"
        :skeletonCount="4"
        :displayError="featuredAuctionsError"
      >
      </AuctionList>
    </section>
  </main>
</template>
