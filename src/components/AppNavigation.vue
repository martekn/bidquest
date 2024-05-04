<script setup>
// #region -IMPORTS-
// Vue-related imports
import { computed, reactive, ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";

// Third-party library imports
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from "@heroicons/vue/20/solid";
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from "@headlessui/vue";

// Custom module/helper imports
import { debounce } from "@/helper/debounce";
import { AuthStateManager } from "@/helper/AuthStateManager";
import { ProfileStateManager } from "@/helper/ProfileStateManager";
import { auth } from "@/api";

// Constants imports
import { navItems } from "@/consts/navItems";

// Custom components
import PopoverMenu from "@/components/popover/PopoverMenu.vue";
import PopoverGroup from "@/components/popover/PopoverGroup.vue";
import PopoverItem from "@/components/popover/PopoverItem.vue";
import SearchInput from "@/components/SearchInput.vue";
import UserAvatar from "@/components/UserAvatar.vue";
import FadeTransition from "./FadeTransition.vue";
// #endregion

const mobileNavOpen = ref(false);
const route = useRoute();

const navbar = ref();
const dropdown = ref();

let visibleItems = reactive([...navItems]);
let dropdownItems = computed(() => navItems.filter((value) => !visibleItems.includes(value)));

const isActive = (itemRoute) => {
  return computed(() => {
    if (itemRoute.params && itemRoute.params.category) {
      return itemRoute.name === route.name && itemRoute.params.category === route.params.category;
    }
    return itemRoute.name === route.name;
  }).value;
};

const collapseMenu = () => {
  const itemElements = Array.from(navbar.value.children).filter((item) =>
    item.classList.contains("item")
  );

  let lastItem = itemElements[itemElements.length - 1];

  if (navbar.value.offsetTop < lastItem.offsetTop) {
    visibleItems.pop();
  }

  for (let i = 0; i < visibleItems.length; i++) {
    // Using requestAnimationFrame to ensure that the element's offsetTop has been properly set
    requestAnimationFrame(() => {
      if (dropdown.value.offsetTop > navbar.value.offsetTop) {
        visibleItems.pop();
      } else {
        return;
      }
    });
  }
};

const expandMenu = debounce(() => {
  visibleItems.push(...dropdownItems.value);

  // Using requestAnimationFrame to ensure that the element's offsetTop has been properly set
  requestAnimationFrame(() => {
    collapseMenu();
  });
});

let currentScreenWidth = document.body.clientWidth;

window.addEventListener("resize", () => {
  if (currentScreenWidth < document.body.clientWidth) {
    expandMenu();
  } else if (currentScreenWidth > document.body.clientWidth) {
    collapseMenu();
  }
  currentScreenWidth = document.body.clientWidth;
});

// Reason for async-await: Ensures proper rendering by delaying execution,
// preventing inaccurate positioning of elements based on offsetTop property.
watch(
  () => navbar.value,
  async () => {
    await new Promise((resolve) => setTimeout(resolve));
    collapseMenu();
  }
);
</script>
<template>
  <div class="bg-white">
    <header class="border-b border-grey-300 pt-5 sm:pb-5">
      <div
        class="mx-auto grid max-w-8xl grid-cols-2 content-center items-center justify-between gap-y-5 sm:grid-cols-[1fr_4fr_1fr] sm:gap-7 sm:px-5"
      >
        <div class="flex gap-3 pl-5 sm:pl-0">
          <button
            class="rounded outline-none focus-visible:ring-2 focus-visible:ring-black sm:hidden"
            @click="mobileNavOpen = true"
          >
            <span class="sr-only">Open main menu</span>
            <Bars3Icon class="h-6 w-6" aria-hidden="true" />
          </button>
          <RouterLink
            :to="{ name: 'home' }"
            class="rounded p-1 font-accent text-xl font-semibold outline-none transition-all duration-150 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-black sm:text-3xl"
          >
            Bid<span class="text-primary-400">Quest</span>
          </RouterLink>
        </div>
        <div
          class="col-span-2 w-full border-t border-grey-300 px-5 py-3 sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:max-w-2xl sm:justify-self-center sm:border-none sm:px-0"
        >
          <SearchInput />
        </div>
        <div
          class="col-start-2 row-start-1 place-self-end self-center pr-5 sm:col-start-3 sm:justify-self-end sm:pr-[0px]"
        >
          <div v-if="AuthStateManager.isAuthenticated()" class="flex min-w-max">
            <FadeTransition mode="out-in">
              <div v-if="ProfileStateManager.profile.status === 'fulfilled'">
                <PopoverMenu id="user-dropdown" align="right" width="15rem">
                  <button class="group/button flex gap-3 rounded text-sm outline-none">
                    <div
                      class="hidden flex-col place-items-end justify-center transition-all group-hover/button:opacity-90 sm:flex"
                    >
                      <span class="font-accent font-medium">{{
                        ProfileStateManager.profile.name
                      }}</span>
                      <span class="text-grey-500"
                        >{{ ProfileStateManager.profile.credits }} credits</span
                      >
                    </div>
                    <div class="relative flex flex-shrink-0 flex-row-reverse justify-center gap-2">
                      <UserAvatar
                        class="h-8 w-8 group-hover/button:brightness-95 sm:h-9 sm:w-9"
                        :url="ProfileStateManager.profile.avatar.url"
                        :alt="ProfileStateManager.profile.avatar.alt"
                      />
                      <div
                        class="grid place-items-center rounded bg-white/75 p-1 transition-all group-hover/button:bg-white/100 sm:absolute sm:bottom-1 sm:right-1"
                      >
                        <ChevronDownIcon
                          class="h-5 w-5 rounded transition-all group-data-[headlessui-state=open]:-rotate-180"
                        />
                      </div>
                    </div>
                  </button>
                  <template #items>
                    <PopoverGroup class="sm:hidden">
                      <PopoverItem as="div">
                        <div
                          class="pointer-events-none flex flex-row-reverse justify-end gap-3 text-sm"
                        >
                          <div class="flex flex-col justify-center">
                            <span class="font-medium">{{ ProfileStateManager.profile.name }}</span>
                            <span class="text-grey-500"
                              >{{ ProfileStateManager.profile.credits }} credits</span
                            >
                          </div>
                          <UserAvatar
                            class="h-9 w-9"
                            :url="ProfileStateManager.profile.avatar.url"
                            :alt="ProfileStateManager.profile.avatar.alt"
                          />
                        </div>
                      </PopoverItem>
                    </PopoverGroup>
                    <PopoverGroup class="sm:border-none">
                      <PopoverItem
                        router-link
                        :route="{
                          name: 'profile',
                          params: { username: ProfileStateManager.profile.name }
                        }"
                      >
                        My profile
                      </PopoverItem>
                      <PopoverItem
                        router-link
                        :route="{
                          name: 'history',
                          params: { username: ProfileStateManager.profile.name }
                        }"
                      >
                        My bid history
                      </PopoverItem>
                    </PopoverGroup>
                    <PopoverGroup>
                      <PopoverItem as="button" @click="auth.logout()" id="logout-button">
                        Logout
                      </PopoverItem>
                    </PopoverGroup>
                  </template>
                </PopoverMenu>
              </div>

              <div v-else>
                <div class="flex animate-pulse gap-3 text-sm animate-duration-[3000ms]">
                  <div class="hidden flex-col place-items-end justify-center gap-2 sm:flex">
                    <span class="h-5 w-11 bg-grey-300 font-accent font-medium"></span>
                    <span class="h-4 w-10 bg-grey-300 text-grey-500"></span>
                  </div>
                  <div class="flex-shrink-0">
                    <div class="h-8 w-8 rounded bg-grey-300 sm:h-9 sm:w-9"></div>
                  </div>
                </div>
              </div>
            </FadeTransition>
          </div>
          <RouterLink
            v-else
            :to="{ name: 'login' }"
            class="max-sm:link max-sm:link-secondary sm:button sm:button-secondary"
            >Login</RouterLink
          >
        </div>
      </div>
    </header>

    <nav class="hidden border-b border-grey-300 sm:block">
      <ul
        ref="navbar"
        class="mx-auto flex w-full max-w-8xl items-center justify-between px-5 after:order-first after:block after:h-6 after:w-[1px] after:bg-grey-300 sm:flex-wrap sm:gap-7"
      >
        <li v-for="{ id, route, name } in visibleItems" :key="id" class="item first:order-first">
          <RouterLink
            :class="{
              'font-semibold after:absolute after:inset-x-0 after:bottom-0 after:block after:h-2 after:rounded after:bg-primary-400':
                isActive(route)
            }"
            class="relative block py-4 text-center outline-none transition-all duration-150 hover:text-grey-500 focus-visible:rounded focus-visible:ring-1 focus-visible:ring-black"
            :to="route"
            ><span aria-hidden="true" class="invisible font-semibold">{{ name }}</span
            ><span class="absolute inset-0 inline-flex h-full w-full items-center justify-center">{{
              name
            }}</span></RouterLink
          >
        </li>

        <li ref="dropdown" id="menudropdown" v-show="dropdownItems.length > 0">
          <PopoverMenu align="right" width="15rem">
            <button
              class="flex items-center gap-2 border-x border-grey-300 px-4 py-4 outline-none transition-all duration-150 hover:bg-grey-200"
            >
              More
              <ChevronDownIcon
                class="h-5 w-5 transition-all group-data-[headlessui-state=open]:-rotate-180"
              />
            </button>
            <template #items>
              <PopoverGroup>
                <PopoverItem
                  v-for="{ route, id, name } in dropdownItems"
                  routerLink
                  :route="route"
                  :key="id"
                >
                  {{ name }}
                </PopoverItem>
              </PopoverGroup>
            </template>
          </PopoverMenu>
        </li>
      </ul>
    </nav>
    <TransitionRoot as="template" :show="mobileNavOpen">
      <Dialog as="div" class="sm:hidden" @close="mobileNavOpen = false" :open="mobileNavOpen">
        <TransitionChild
          as="template"
          enter="ease-in-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in-out duration-300"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div
            class="fixed inset-0 bg-black/75"
            aria-hidden="true"
            @click="mobileNavOpen = false"
          />
        </TransitionChild>
        <TransitionChild
          as="template"
          enter="transform transition ease-in-out duration-200"
          enter-from="-translate-x-full"
          enter-to="translate-x-0"
          leave="transform transition ease-in-out duration-200"
          leave-from="-translate-x-full"
          leave-to="translate-x-0"
        >
          <DialogPanel
            class="fixed inset-y-0 left-0 z-50 max-h-[100svh] w-full max-w-sm overflow-y-auto bg-white py-5 shadow-md shadow-black/10"
          >
            <TransitionChild
              as="nav"
              enter="ease-in-out duration-300"
              enter-from="opacity-0"
              enter-to="opacity-100"
              leave="ease-in-out duration-300"
              leave-from="opacity-100"
              leave-to="opacity-0"
            >
              <div class="flex items-center justify-between px-5">
                <RouterLink
                  :to="{ name: 'home' }"
                  class="rounded font-accent text-xl font-semibold outline-none transition-all duration-150 hover:opacity-95 focus-visible:ring-2 focus-visible:ring-black sm:hidden sm:text-3xl"
                  @click="mobileNavOpen = false"
                >
                  Bid<span class="text-primary-400">Quest</span>
                </RouterLink>
                <button
                  type="button"
                  class="rounded p-2 text-grey-500 outline-none focus-visible:ring-2 focus-visible:ring-black"
                  @click="mobileNavOpen = false"
                >
                  <span class="sr-only">Close menu</span>
                  <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <ul class="mt-5">
                <li v-for="{ id, route, name } in navItems" :key="id">
                  <RouterLink
                    :class="{
                      'px-1 font-semibold after:absolute after:inset-y-0 after:left-0 after:block after:w-2 after:rounded after:bg-primary-400':
                        isActive(route)
                    }"
                    class="relative block w-full px-5 py-4 outline-none transition-all duration-150 hover:bg-grey-200 focus-visible:rounded focus-visible:inner-border focus-visible:inner-border-black"
                    :to="route"
                    @click="mobileNavOpen = false"
                    >{{ name }}</RouterLink
                  >
                </li>
              </ul>
            </TransitionChild>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </TransitionRoot>
  </div>
</template>
