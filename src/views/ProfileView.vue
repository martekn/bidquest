<script setup>
import { reactive, ref, watch, computed } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { profile } from "@/api";
import { ChevronDownIcon, CameraIcon } from "@heroicons/vue/20/solid";
import { ProfileStateManager } from "@/helper/ProfileStateManager";
import { AuthStateManager } from "@/helper/AuthStateManager";
import { baseAvatar } from "@/consts/baseAvatar";
import { notify } from "notiwind";
import AuctionCard from "@/components/AuctionCard.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import NotFoundView from "./NotFoundView.vue";
import LoadingIndicator from "@/components/LoadingIndicator.vue";
import ErrorDialog from "@/components/ErrorDialog.vue";
import PopoverMenu from "@/components/popover/PopoverMenu.vue";
import MenuGroup from "@/components/MenuGroup.vue";
import PopoverItem from "@/components/popover/PopoverItem.vue";
import ConfirmationDialog from "@/components/ConfirmationDialog.vue";
import EditAvatarDialog from "@/components/EditAvatarDialog.vue";

const route = useRoute();
const apiLimit = 20;
const isEditOpen = ref(false);
const isRemoveOpen = ref(false);

const isInvalidId = ref(false);
const user = reactive({
  isLoading: true,
  isError: true,
  name: "",
  wins: 0,
  avatar: { url: "", alt: "" }
});

const activeAuctions = reactive({ isLoading: true, isError: false, auctions: [] });
const activeAuctionsMeta = ref();
const isRegisteredUser = route.params.username === AuthStateManager.getUsername();

const allAuctions = reactive({ isLoading: true, isError: false, auctions: [] });
const allAuctionsMeta = ref();

const showMoreLoading = ref(false);
const showMoreError = ref(false);

const auctions = computed(() => {
  if (route.params.view === "all") {
    return allAuctions.auctions;
  }

  return activeAuctions.auctions;
});

const showButton = computed(() => {
  if (route.params.view !== "all") {
    return !!activeAuctionsMeta.value.nextPage;
  }

  if (route.params.view === "all") {
    return !!allAuctionsMeta.value.nextPage;
  }

  return false;
});

const showMore = async () => {
  try {
    showMoreLoading.value = true;
    showMoreError.value = false;
    if (route.params.view !== "all") {
      resetAuctions(activeAuctions);
      const response = await profile.getUserAuctions(
        route.params.username,
        true,
        apiLimit,
        "endsAt",
        "asc",
        activeAuctionsMeta.value.nextPage
      );
      handleAuctionsResponse(response, activeAuctions, activeAuctionsMeta);
    } else {
      resetAuctions(allAuctions);
      const response = await profile.getUserAuctions(
        route.params.username,
        false,
        apiLimit,
        "created",
        "desc",
        allAuctionsMeta.value.nextPage
      );
      handleAuctionsResponse(response, allAuctions, allAuctionsMeta);
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

const setUserData = (response) => {
  const { name, _count, avatar } = response;
  user.name = name;
  user.wins = _count.wins;
  user.avatar.url = avatar.url;
  user.avatar.alt = avatar.alt;
  user.isLoading = false;
};

const setUserError = (statusCode) => {
  if (statusCode === 404) {
    isInvalidId.value = true;
  }

  user.isError = true;
  user.isLoading = false;
};

const setupProfile = async () => {
  resetAuctions(user);
  resetAuctions(activeAuctions, true);
  resetAuctions(allAuctions, true);

  let profileResponse;
  let activeAuctionsResponse;
  let auctionsResponse;

  if (isRegisteredUser) {
    [activeAuctionsResponse, auctionsResponse] = await Promise.allSettled([
      profile.getUserAuctions(route.params.username, true, apiLimit, "endsAt", "asc", 1),
      profile.getUserAuctions(route.params.username, false, apiLimit, "created", "desc", 1)
    ]);

    if (ProfileStateManager.profile.status === "fulfilled") {
      setUserData(ProfileStateManager.profile);
    } else if (ProfileStateManager.profile.status === "rejected") {
      setUserError(ProfileStateManager.profile.statusCode);
    }
  } else {
    [profileResponse, activeAuctionsResponse, auctionsResponse] = await Promise.allSettled([
      profile.getProfile(route.params.username),
      profile.getUserAuctions(route.params.username, true, apiLimit, "endsAt", "asc", 1),
      profile.getUserAuctions(route.params.username, false, apiLimit, "created", "desc", 1)
    ]);

    if (profileResponse.status === "fulfilled") {
      setUserData(profileResponse.value.data);
    } else if (profileResponse.status === "rejected") {
      setUserError(profileResponse.reason.statusCode);
    }
  }

  if (activeAuctionsResponse.status === "fulfilled") {
    handleAuctionsResponse(activeAuctionsResponse.value, activeAuctions, activeAuctionsMeta);
  } else if (activeAuctionsResponse.status === "rejected") {
    auctionError(activeAuctions);
  }

  if (auctionsResponse.status === "fulfilled") {
    handleAuctionsResponse(auctionsResponse.value, allAuctions, allAuctionsMeta, true);
  } else if (auctionsResponse.status === "rejected") {
    auctionError(allAuctions);
  }
};

const deleteAvatar = async () => {
  try {
    await profile.updateAvatar({ avatar: baseAvatar });

    ProfileStateManager.update();
    isRemoveOpen.value = false;
    notify(
      {
        group: "general",
        title: "Image has been removed",
        type: "success"
      },
      2000
    );
  } catch (error) {
    isRemoveOpen.value = false;
    notify(
      {
        group: "general",
        title: "Unable to remove image",
        text: "Please try again",
        type: "error"
      },
      3000
    );
  }
};

watch(
  () => route.params.username,
  () => {
    setupProfile();
  },
  { immediate: true }
);
</script>

<template>
  <LoadingIndicator v-if="user.isLoading" color="dark" class="my-10" />
  <NotFoundView v-else-if="isInvalidId"></NotFoundView>
  <main v-else class="mx-auto w-full max-w-8xl px-5 pb-11 pt-6 md:pb-12 md:pt-7">
    <template v-if="!isInvalidId && !user.isLoading && !user.isError">
      <section
        class="flex flex-row-reverse flex-wrap-reverse items-center justify-end gap-5 pb-6 md:gap-6 md:pb-7"
      >
        <div>
          <h1>{{ isRegisteredUser ? ProfileStateManager.profile.name : user.name }}</h1>
          <span
            >{{ isRegisteredUser ? ProfileStateManager.profile._count.wins : user.wins }}
            {{
              (isRegisteredUser ? ProfileStateManager.profile._count.wins : user.wins) !== 1
                ? "auctions"
                : "auction"
            }}
            won</span
          >
        </div>
        <div class="relative">
          <UserAvatar
            class="h-12 w-12"
            :url="isRegisteredUser ? ProfileStateManager.profile.avatar.url : user.avatar.url"
            :alt="isRegisteredUser ? ProfileStateManager.profile.avatar.alt : user.avatar.alt"
          />
          <div class="absolute bottom-2 right-2 h-7 w-7">
            <PopoverMenu
              v-if="isRegisteredUser"
              as="div"
              id="user-dropdown"
              align="left"
              width="10rem"
              class=""
            >
              <button
                class="grid h-7 w-7 place-items-center gap-3 rounded-sm bg-white/75 outline-none ring-1 ring-white/75 transition-all hover:bg-white/100 ui-focus-visible:ring-white/100 ui-focus-visible:inner-border-2 ui-focus-visible:inner-border-black"
              >
                <CameraIcon class="h-6 w-6" />
              </button>
              <template #items>
                <MenuGroup>
                  <PopoverItem as="button" @click="isEditOpen = true" id="edit-avatar-button">
                    Change image
                  </PopoverItem>
                  <PopoverItem as="button" @click="isRemoveOpen = true" id="delete-avatar-button">
                    Remove image
                  </PopoverItem>
                </MenuGroup>
              </template>
            </PopoverMenu>
          </div>
        </div>
      </section>
      <div>
        <div class="flex gap-9 border-b border-b-grey-300 text-sm font-medium">
          <RouterLink
            :class="{
              ' border-b-primary-400': route.params.view !== 'all',
              ' border-b-transparent': route.params.view === 'all'
            }"
            class="relative -bottom-1 border-b-[3px] p-1 outline-none transition-all hover:text-grey-500 focus-visible:rounded focus-visible:ring-2 focus-visible:ring-black"
            :to="{ name: 'profile', params: { username: user.name, view: 'active' } }"
            >Active
            <span class="text-grey-500">({{ activeAuctionsMeta.totalCount }})</span></RouterLink
          ><RouterLink
            :class="{
              ' border-b-primary-400 ': route.params.view === 'all',
              ' border-b-transparent ': route.params.view !== 'all'
            }"
            class="relative -bottom-1 border-b-[3px] p-1 outline-none transition-all hover:text-grey-500 focus-visible:rounded focus-visible:ring-2 focus-visible:ring-black"
            :to="{ name: 'profile', params: { username: user.name, view: 'all' } }"
            >All <span class="text-grey-500">({{ allAuctionsMeta.totalCount }})</span></RouterLink
          >
        </div>
        <section class="mt-6 space-y-5 md:mt-7 md:space-y-6">
          <h2>
            <template v-if="route.params.view === 'all'">All auctions</template>
            <template v-else>Active auctions</template>
          </h2>
          <template
            v-if="
              ((!activeAuctions.isError && route.params.view !== 'all') ||
                (!allAuctions.isError && route.params.view === 'all')) &&
              auctions.length > 0
            "
          >
            <ul class="grid gap-5 xs:grid-cols-2 md:grid-cols-4 md:gap-6">
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
            <div class="grid place-items-center">
              <span class="mt-9 block border-b border-b-grey-300 px-3 pb-3 text-xs text-grey-500"
                >Showing {{ auctions.length }} of
                {{
                  route.params.view !== "all"
                    ? activeAuctionsMeta.totalCount
                    : allAuctionsMeta.totalCount
                }}
                auctions</span
              >
              <div v-if="showButton">
                <LoadingIndicator color="primary" class="mt-5" v-if="showMoreLoading" />
                <button v-else @click="showMore" class="button button-primary mt-5">
                  <span class="flex items-center justify-between gap-5"
                    ><span class="flex-shrink-0">Show more</span> <ChevronDownIcon class="h-6 w-6"
                  /></span>
                </button>
              </div>
              <div v-if="showMoreError" class="mt-5">
                <p class="max-w-[35ch] text-center text-red-400">
                  There was an error getting more auctions, please try again.
                </p>
              </div>
            </div>
          </template>
          <ErrorDialog
            v-if="
              (activeAuctions.isError && route.params.view !== 'all') ||
              (allAuctions.isError && route.params.view === 'all')
            "
            title="Oops! Unable to Retrieve Auctions"
          >
            <p>
              We're sorry, but we couldn't fetch auctions at the moment. Please ensure you have a
              stable internet connection and try refreshing the page. If the issue persists, our
              team is here to assist you. Feel free to reach out for further assistance.
            </p>
          </ErrorDialog>
          <ErrorDialog v-else-if="auctions.length === 0" title="No Auctions Found" state="info">
            <p>
              We're sorry, but it seems that there are currently no auctions available at the
              moment. Our inventory is constantly being updated, so please check back later for new
              listings. In the meantime, feel free to explore other sections of our platform or
              reach out to our customer support team if you have any questions or concerns. Thank
              you for your patience and understanding.
            </p>
          </ErrorDialog>
        </section>
      </div>
    </template>
    <template v-else>
      <ErrorDialog title="Oops! Unable to Retrieve Profile ">
        <p>
          We're sorry, but we couldn't fetch this profile at the moment. Please ensure you have a
          stable internet connection and try refreshing the page. If the issue persists, our team is
          here to assist you. Feel free to reach out for further assistance.
        </p>
      </ErrorDialog>
    </template>
    <ConfirmationDialog
      :isOpen="isRemoveOpen"
      @close="isRemoveOpen = false"
      @confirm="deleteAvatar"
      ctaText="Remove"
      title="Remove Profile Picture"
    >
      Are you sure you want to remove your profile picture? This action cannot be undone, and your
      current picture will be permanently deleted</ConfirmationDialog
    >
    <EditAvatarDialog
      :isOpen="isEditOpen"
      @close="isEditOpen = false"
      @avatarChange="ProfileStateManager.update()"
    />
  </main>
</template>
