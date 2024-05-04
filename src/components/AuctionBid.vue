<script setup>
// #region -IMPORTS-
// Vue-related imports
import { ref, computed } from "vue";
import { RouterLink } from "vue-router";

// Third-party library imports
import dayjs from "dayjs";
import { notify } from "notiwind";
import { PencilSquareIcon } from "@heroicons/vue/20/solid";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";

// Custom module/helper imports
import { nanoid } from "@/helper/nanoid";
import { AuthStateManager } from "@/helper/AuthStateManager";
import { ProfileStateManager } from "@/helper/ProfileStateManager";
import { getCurrentBid } from "@/helper/getCurrentBid";
import { auction } from "@/api";

// Custom components
import ErrorDialog from "@/components/ErrorDialog.vue";
import TextInput from "@/components/formElements/TextInput.vue";
import ConfirmationDialog from "@/components/ConfirmationDialog.vue";
// #endregion

const emit = defineEmits(["bid"]);

const props = defineProps({
  endsAt: String,
  updatedAt: String,
  createdAt: String,
  seller: String,
  bids: Array,
  id: String
});

const isConfirmBidOpen = ref(false);

const bidInput = ref();
const isBidError = ref();
const bidErrorMessage = ref();
const bidApiError = ref(false);
const isHistoryClosed = ref(true);

const hasEnded = !dayjs(props.endsAt).isAfter(dayjs());
const formattedCreatedDate = dayjs(props.createdAt).format("DD/MM/YYYY HH:mm");
const formattedUpdatedDate = dayjs(props.updatedAt).format("DD/MM/YYYY HH:mm");
const formattedEndDate = dayjs(props.endsAt).format("DD/MM/YYYY HH:mm");
const endDate = dayjs(props.endsAt);
const countdown = ref();

const highestBid = computed(() => getCurrentBid(props.bids));
const sortedBids = computed(() => [...props.bids].sort((a, b) => b.amount - a.amount));
const bidsPreview = computed(() => sortedBids.value.slice(0, 3));
const bidsDropdown = computed(() => sortedBids.value.slice(3));

const isUsersAuction = computed(() => {
  if (AuthStateManager.isAuthenticated() && AuthStateManager.getUsername() === props.seller) {
    return true;
  }
  return false;
});

for (const bid of props.bids) {
  bid.id = nanoid();
}

const toggleBidHistory = () => {
  isHistoryClosed.value = !isHistoryClosed.value;
};

const bid = async () => {
  bidErrorMessage.value = "";
  bidApiError.value = false;
  isBidError.value = false;
  if (isNaN(Number(bidInput.value))) {
    isBidError.value = true;
    bidErrorMessage.value = "Enter a number";
  } else if (Number(bidInput.value <= highestBid.value)) {
    isBidError.value = true;
    bidErrorMessage.value = "Enter a number higher than the current bid";
  } else {
    bidErrorMessage.value = "";
    isBidError.value = false;
    isConfirmBidOpen.value = true;
  }
};

const submitBid = async () => {
  try {
    await auction.bid(props.id, { amount: Number(bidInput.value) });
    notify(
      {
        group: "general",
        title: "Success",
        text: "Your bid was placed!",
        type: "success"
      },
      4000
    );
    emit("bid");

    isConfirmBidOpen.value = false;
    bidInput.value = "";
    ProfileStateManager.update();
  } catch (error) {
    bidApiError.value = true;
    isConfirmBidOpen.value = false;
  }
};

function updateCountdown() {
  const currentDate = dayjs();
  const difference = endDate.diff(currentDate);

  const days = Math.floor(difference / (24 * 60 * 60 * 1000));
  const hours = Math.floor((difference % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((difference % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((difference % (60 * 1000)) / 1000);

  if (days > 0) {
    countdown.value = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  } else if (hours > 0 || days > 0) {
    countdown.value = `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0 || hours > 0 || days > 0) {
    countdown.value = ` ${minutes}m ${seconds}s`;
  } else {
    countdown.value = `${seconds}s`;
  }
  setTimeout(updateCountdown, 1000);
}

updateCountdown();
</script>
<template>
  <div class="space-y-7">
    <div class="flex items-start justify-between">
      <div class="flex flex-col leading-tight">
        <span class="text-xs text-grey-500"
          ><template v-if="!hasEnded">Current bid</template>
          <template v-else>Final bid</template></span
        >
        <span class="text-2xl font-medium md:text-4xl">{{ highestBid }} credits</span>
      </div>
      <RouterLink
        v-if="isUsersAuction"
        :to="{ name: 'edit', params: { id: id } }"
        class="link link-secondary flex items-center gap-2 font-medium"
        ><PencilSquareIcon class="h-5 w-5" />Edit</RouterLink
      >
    </div>
    <form
      @submit.prevent
      v-if="AuthStateManager.isAuthenticated() && !isUsersAuction && !hasEnded"
      class="grid grid-cols-[1fr_auto] items-start gap-x-2 gap-y-4"
    >
      <ErrorDialog
        v-if="bidApiError"
        class="col-span-full"
        title="Failed to place bid, please try again"
      >
      </ErrorDialog>
      <TextInput
        class="w-full gap-0"
        id="bid"
        name="bid"
        type="text"
        v-model="bidInput"
        placeholder="Place your bid"
        label="Place your bid"
        :is-error="isBidError"
        :error="bidErrorMessage"
        hidden-label
      /><button
        @click="bid"
        class="start button button-primary border-[3px] border-transparent py-3"
      >
        Bid
      </button>
    </form>
    <div class="flex gap-3 border-y border-grey-300 py-3 text-sm font-medium">
      <span v-if="!hasEnded">Ends in:</span>
      <span v-else class="text-primary-400">Auction has ended</span>

      <span v-if="!hasEnded" class="text-primary-400"> {{ countdown }}</span>
    </div>
    <div v-if="bidsPreview.length > 0">
      <h3 class="mb-2 text-xs">Bid history</h3>
      <ul class="space-y-2">
        <li
          v-for="{ bidder, amount } in bidsPreview"
          :key="bidder + amount"
          class="flex w-full justify-between gap-2 rounded p-2 first-of-type:bg-grey-300/50 first-of-type:font-semibold"
        >
          <RouterLink
            :to="{ name: 'profile', params: { username: bidder.name } }"
            class="outline-none transition-all hover:text-grey-500 focus-visible:underline"
            >{{ bidder.name }}</RouterLink
          >
          <span>{{ amount }}</span>
        </li>
      </ul>

      <div v-if="bidsDropdown.length > 0">
        <button
          @click="toggleBidHistory"
          class="link link-secondary link-sm mt-5 flex items-center gap-2 p-2 text-sm"
        >
          See all bids ({{ bidsDropdown.length }}) <ChevronDownIcon class="h-5 w-5" />
        </button>
        <ul class="mt-5" :class="{ hidden: isHistoryClosed }">
          <li
            v-for="{ bidder, amount } in bidsDropdown"
            :key="bidder + amount"
            class="flex w-full justify-between gap-2 p-2"
          >
            <RouterLink
              :to="{ name: 'profile', params: { username: bidder.name } }"
              class="outline-none transition-all hover:text-grey-500 focus-visible:underline"
              >{{ bidder.name }}</RouterLink
            >
            <span>{{ amount }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div
      :class="{ 'border-t border-grey-300 pt-3': bids.length > 0 }"
      class="flex flex-wrap justify-between gap-4 text-xs text-grey-500"
    >
      <span v-if="createdAt === updatedAt">Created {{ formattedCreatedDate }}</span>
      <span v-else>Updated {{ formattedUpdatedDate }}</span>
      <span>{{ !hasEnded ? `Ends ${formattedEndDate}` : `Ended ${formattedEndDate}` }}</span>
    </div>

    <section
      v-if="!AuthStateManager.isAuthenticated()"
      class="grid place-items-center rounded border border-grey-300 bg-grey-300/50 p-6 text-center md:p-7"
    >
      <h2 class="text-lg">Ready to bid?</h2>
      <p class="mt-2">Login or Register to start bidding</p>
      <div class="mt-6 grid grid-cols-2 gap-5">
        <RouterLink :to="{ name: 'login' }" class="button button-primary">Login</RouterLink>
        <RouterLink :to="{ name: 'register' }" class="button button-secondary">Register</RouterLink>
      </div>
    </section>
    <ConfirmationDialog
      :isOpen="isConfirmBidOpen"
      @close="isConfirmBidOpen = false"
      @confirm="submitBid"
      ctaText="Place bid"
      title="Confirm your bid"
    >
      Please confirm that you want to submit a bid of {{ bidInput }} credits. This action is
      irreversible. Are you sure you want to proceed?</ConfirmationDialog
    >
  </div>
</template>
