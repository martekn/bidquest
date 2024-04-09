<script setup>
import { RouterLink } from "vue-router";

import dayjs from "dayjs";
import { getCurrentBid } from "@/helper/getCurrentBid";

const props = defineProps({
  endDate: { type: String, default: "" },
  imageSrc: { type: String, default: "image-placeholder.jpg" },
  imageAlt: { type: String, default: "" },
  id: { type: String, default: "" },
  title: { type: String, default: "" },
  bids: { type: Array, default: () => [] }
});

const highestBid = getCurrentBid(props.bids);
const auctionEnded = !dayjs(props.endDate).isAfter(dayjs());
const time = dayjs(props.endDate).format("MMM DD, HH:mm");
</script>
<template>
  <div class="group/card relative flex flex-col space-y-5">
    <div class="relative inline-block overflow-hidden rounded">
      <div class="aspect-h-2 aspect-w-3">
        <img
          class="h-full w-full rounded bg-grey-300 object-cover text-transparent brightness-90 transition-all duration-500 group-hover/card:scale-110 group-hover/card:brightness-100"
          :src="imageSrc"
          :alt="imageAlt ?? ''"
          onerror="this.onerror=null;this.src='/image-placeholder.jpg';"
        />
      </div>
      <div
        class="z-5 absolute bottom-2 left-2 grid min-h-7 min-w-9 place-items-center rounded bg-black/75 p-2 text-xs text-white md:text-sm"
      >
        {{ auctionEnded ? "Ended" : time }}
      </div>
    </div>
    <div class="space-y-5">
      <RouterLink
        class="font-accent font-medium outline-none before:absolute before:inset-0 before:rounded before:bg-transparent hover:underline hover:decoration-grey-400 hover:underline-offset-4 focus-visible:before:ring-2 focus-visible:before:ring-black focus-visible:before:ring-offset-4"
        :to="{ name: 'auction', params: { id: id } }"
        >{{ title }}</RouterLink
      >

      <div class="flex flex-col">
        <span class="text-xs text-grey-500">{{ auctionEnded ? "Final bid" : "Current bid" }}</span>
        <span class="text-medium font-accent text-sm" v-if="highestBid !== 0"
          >{{ highestBid }} credits</span
        >
        <span v-else class="text-medium font-accent text-sm text-grey-500">{{
          auctionEnded ? "No final bid" : "No current bid"
        }}</span>
      </div>
    </div>
  </div>
</template>
