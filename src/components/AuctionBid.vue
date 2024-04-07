<script setup>
import { ref, reactive } from "vue";
import { RouterLink } from "vue-router";
import { AuthStateManager } from "@/helper/AuthStateManager";
import { PencilSquareIcon } from "@heroicons/vue/20/solid";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";
import { nanoid } from "@/helper/nanoid";
import { getCurrentBid } from "@/helper/getCurrentBid";
import dayjs from "dayjs";
import TextInput from "./formElements/TextInput.vue";

const props = defineProps({
  endsAt: { type: String },
  updatedAt: { type: String },
  createdAt: { type: String },
  seller: { type: String },
  bids: { type: Array, default: () => [] },
  id: { type: String }
});

const bidInput = ref();
const isBidError = ref();
const bidErrorMessage = ref();
const isHistoryClosed = ref(true);

const formattedCreatedDate = dayjs(props.createdAt).format("DD/MM/YYYY HH:MM");
const formattedUpdatedDate = dayjs(props.updatedAt).format("DD/MM/YYYY HH:MM");
const formattedEndDate = dayjs(props.endsAt).format("DD/MM/YYYY HH:MM");
const endDate = dayjs(props.endsAt);
const countdown = ref();

const highestBid = getCurrentBid(props.bids);
const sortedBids = [...props.bids].sort((a, b) => a.amount < b.amount);
const bidsPreview = reactive(sortedBids.slice(0, 3));
const bidsDropdown = reactive(sortedBids.slice(3));

const isUsersAuction = ref(false);
if (AuthStateManager.isAuthenticated() && AuthStateManager.getUsername() === props.seller) {
  isUsersAuction.value = true;
}

for (const bid of props.bids) {
  bid.id = nanoid();
}

const toggleBidHistory = () => {
  isHistoryClosed.value = !isHistoryClosed.value;
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
        <span class="text-xs text-grey-500">Current bid</span>
        <span class="text-2xl font-medium md:text-4xl">{{ highestBid }} credits</span>
      </div>
      <RouterLink
        v-if="isUsersAuction"
        :to="{ name: 'auction edit', params: { id: id } }"
        class="link link-secondary flex items-center gap-2 font-medium"
        ><PencilSquareIcon class="h-5 w-5" />Edit</RouterLink
      >
    </div>
    <div v-if="AuthStateManager.isAuthenticated() && !isUsersAuction" class="flex gap-2">
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
      /><button class="button button-primary py-2">Bid</button>
    </div>
    <div class="border-y border-grey-300 py-3 text-sm font-medium">
      Closes in:
      <span class="text-primary-400">{{ countdown }}</span>
    </div>
    <div>
      <ul class="space-y-2">
        <li
          v-for="{ bidder, amount, id } in bidsPreview"
          :key="id"
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
            v-for="{ bidder, amount, id } in bidsDropdown"
            :key="id"
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
      class="flex justify-between gap-2 text-xs text-grey-500"
    >
      <span v-if="createdAt === updatedAt">Created {{ formattedCreatedDate }}</span>
      <span v-else>Updated {{ formattedUpdatedDate }}</span>
      <span>Ends {{ formattedEndDate }}</span>
    </div>

    <div v-if="!AuthStateManager.isAuthenticated()">
      <h3>Ready to bid?</h3>
      <p>Login or Register to start bidding</p>
      <div class="flex">
        <RouterLink to="/login" class="button button-primary">Login</RouterLink>
        <RouterLink to="/register" class="button button-secondary">Register</RouterLink>
      </div>
    </div>
  </div>
</template>
