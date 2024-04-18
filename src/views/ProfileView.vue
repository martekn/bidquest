<script setup>
// #region -IMPORTS-
// Vue-related imports
import { reactive, ref, watch, computed } from "vue";
import { useRoute, RouterLink } from "vue-router";

// Third-party library imports
import { notify } from "notiwind";
import { CameraIcon } from "@heroicons/vue/20/solid";

// Custom module/helper imports
import { profile } from "@/api";
import { ProfileStateManager } from "@/helper/ProfileStateManager";
import { AuthStateManager } from "@/helper/AuthStateManager";

// Constants imports
import { baseAvatar } from "@/consts/baseAvatar";

// Custom components
import AuctionList from "@/components/AuctionList.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import LoadingIndicator from "@/components/LoadingIndicator.vue";
import ErrorDialog from "@/components/ErrorDialog.vue";
import PopoverMenu from "@/components/popover/PopoverMenu.vue";
import MenuGroup from "@/components/MenuGroup.vue";
import PopoverItem from "@/components/popover/PopoverItem.vue";
import ConfirmationDialog from "@/components/ConfirmationDialog.vue";
import EditAvatarDialog from "@/components/EditAvatarDialog.vue";
import EmptyState from "@/components/EmptyState.vue";
import ShowMore from "@/components/ShowMore.vue";
// #endregion

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

const activeAuctions = reactive({
  firstFetchLoaded: false,
  isLoading: true,
  isError: false,
  auctions: []
});
const activeAuctionsMeta = ref();
const isRegisteredUser = computed(() => route.params.username === AuthStateManager.getUsername());

const allAuctions = reactive({
  firstFetchLoaded: false,
  isLoading: true,
  isError: false,
  auctions: []
});
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

  if (isRegisteredUser.value) {
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
    activeAuctions.firstFetchLoaded = true;
  } else if (activeAuctionsResponse.status === "rejected") {
    auctionError(activeAuctions);
    activeAuctions.firstFetchLoaded = true;
  }

  if (auctionsResponse.status === "fulfilled") {
    handleAuctionsResponse(auctionsResponse.value, allAuctions, allAuctionsMeta, true);
    allAuctions.firstFetchLoaded = true;
  } else if (auctionsResponse.status === "rejected") {
    auctionError(allAuctions);
    allAuctions.firstFetchLoaded = true;
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
  <main v-else class="main-base">
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
            <span class="text-grey-500"
              >({{ activeAuctionsMeta?.totalCount ?? 0 }})</span
            ></RouterLink
          ><RouterLink
            :class="{
              ' border-b-primary-400 ': route.params.view === 'all',
              ' border-b-transparent ': route.params.view !== 'all'
            }"
            class="relative -bottom-1 border-b-[3px] p-1 outline-none transition-all hover:text-grey-500 focus-visible:rounded focus-visible:ring-2 focus-visible:ring-black"
            :to="{ name: 'profile', params: { username: user.name, view: 'all' } }"
            >All
            <span class="text-grey-500">({{ allAuctionsMeta?.totalCount ?? 0 }})</span></RouterLink
          >
        </div>
        <section class="mt-6 space-y-5 md:mt-7 md:space-y-6">
          <h2>
            <template v-if="route.params.view === 'all'">All auctions</template>
            <template v-else>Active auctions</template>
          </h2>
          <AuctionList
            class="mt-5 md:mt-6"
            :auctions="auctions"
            :loaded="
              (activeAuctions.firstFetchLoaded && route.params.view !== 'all') ||
              (allAuctions.firstFetchLoaded && route.params.view === 'all')
            "
            loaderType="regular"
            :displayError="
              (activeAuctions.isError && route.params.view !== 'all') ||
              (allAuctions.isError && route.params.view === 'all')
            "
          >
            <ShowMore
              v-if="
                (activeAuctions.firstFetchLoaded &&
                  route.params.view !== 'all' &&
                  activeAuctions.auctions.length > 0) ||
                (allAuctions.firstFetchLoaded &&
                  route.params.view === 'all' &&
                  allAuctions.auctions.length > 0)
              "
              class="mt-7"
              :show="showButton"
              :error="showMoreError"
              @loadMore="showMore"
              :loading="showMoreLoading"
              type="bids"
              :visibleCount="auctions.length"
              :totalCount="
                route.params.view !== 'all'
                  ? activeAuctionsMeta.totalCount
                  : allAuctionsMeta.totalCount
              "
            />

            <EmptyState
              class="mt-5"
              v-if="auctions.length === 0"
              type="auction"
              title="No auctions found"
              :text="
                isRegisteredUser
                  ? `You do not have any ${route.params.view !== 'active' ? '' : 'active '}auctions at the moment`
                  : `${isRegisteredUser ? ProfileStateManager.profile.name : user.name} does not have any ${route.params.view !== 'active' ? '' : 'active '}auctions at the moment, please try again later`
              "
            >
              <RouterLink
                :to="{ name: 'create' }"
                v-if="isRegisteredUser"
                class="button button-primary mt-7"
                >Create auction</RouterLink
              >
            </EmptyState>
          </AuctionList>
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
