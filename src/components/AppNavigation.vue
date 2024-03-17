<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { computed, onMounted, reactive } from "vue";
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from "@heroicons/vue/20/solid";
import PopoverMenu from "./popover/PopoverMenu.vue";
import MenuGroup from "./MenuGroup.vue";
import PopoverItem from "./popover/PopoverItem.vue";
import { Dialog, DialogPanel } from "@headlessui/vue";
import SearchInput from "./SearchInput.vue";
import { debounce } from "@/helper/debounce";

const navItems = [
  { name: "+ Create auction", path: "/auction/create", id: 1 },
  { name: "All auctions", path: "/auctions", id: 2 },
  { name: "Jewelry", path: "/auctions/jewelry", id: 3 },
  { name: "Art", path: "/auctions/art", id: 4 },
  { name: "Fashion", path: "/auctions/fashion", id: 5 },
  { name: "Electronics", path: "/auctions/electronics", id: 6 },
  { name: "Home", path: "/auctions/home", id: 7 },
  { name: "Toys", path: "/auctions/toys", id: 8 },
  { name: "Sports", path: "/auctions/sports", id: 9 },
  { name: "Vehicles", path: "/auctions/vehicles", id: 10 },
  { name: "Miscellaneous", path: "/auctions/miscellaneous", id: 11 }
];

const mobileNavOpen = ref(false);

let visibleItems = reactive([...navItems]);
let dropdownItems = computed(() => navItems.filter((value) => !visibleItems.includes(value)));

const collapseMenu = () => {
  const itemElements = Array.from(document.querySelectorAll("nav ul .item"));
  const firstItem = itemElements[0];
  let lastItem = itemElements[itemElements.length - 1];

  if (firstItem.offsetTop < lastItem.offsetTop) {
    visibleItems.pop();
  }

  const dropdown = document.querySelector("#menudropdown");

  for (let i = 0; i < visibleItems.length; i++) {
    // Using requestAnimationFrame to ensure that the element's offsetTop has been properly set
    requestAnimationFrame(() => {
      if (dropdown.offsetTop > firstItem.offsetTop) {
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
onMounted(async () => {
  // console.log(document.querySelector("nav"));
  await new Promise((resolve) => setTimeout(resolve));

  collapseMenu();
});
</script>
<template>
  <div class="bg-white">
    <header class="border-b border-grey-300 pt-5 sm:pb-5">
      <div
        class="mx-auto flex max-w-8xl content-center items-center justify-between gap-7 max-sm:grid max-sm:grid-cols-2 max-sm:gap-4 sm:px-5"
      >
        <div class="flex gap-3 max-sm:pl-5">
          <button
            class="rounded outline-none focus-visible:ring-2 focus-visible:ring-black sm:hidden"
            @click="mobileNavOpen = true"
          >
            <span class="sr-only">Open main menu</span>
            <Bars3Icon class="h-6 w-6" aria-hidden="true" />
          </button>
          <RouterLink
            to="/"
            class="rounded p-1 font-accent text-3xl font-semibold outline-none hover:opacity-95 focus-visible:ring-2 focus-visible:ring-black max-sm:text-xl"
          >
            Bid<span class="text-primary-400">Quest</span>
          </RouterLink>
        </div>
        <div
          class="col-span-2 w-full border-grey-300 py-3 max-sm:border-t max-sm:px-5 sm:max-w-2xl"
        >
          <SearchInput />
        </div>
        <div class="col-start-2 row-start-1 place-self-end pr-5 sm:place-self-auto sm:pr-[0px]">
          <RouterLink
            to="/login"
            class="max-sm:link max-sm:link-secondary sm:button sm:button-secondary"
            >Login</RouterLink
          >
        </div>
      </div>
    </header>

    <nav class="hidden border-b border-grey-300 sm:block">
      <ul
        class="mx-auto flex w-full max-w-8xl items-center justify-between px-5 after:order-first after:block after:h-6 after:w-[1px] after:bg-grey-300 sm:flex-wrap sm:gap-7"
      >
        <li v-for="item in visibleItems" :key="item.id" class="item first:order-first">
          <RouterLink
            class="relative block w-full px-2 py-4 outline-none hover:text-grey-500 focus-visible:rounded focus-visible:ring-1 focus-visible:ring-black [&.router-link-active]:font-semibold [&.router-link-active]:after:absolute [&.router-link-active]:after:inset-x-0 [&.router-link-active]:after:bottom-0 [&.router-link-active]:after:block [&.router-link-active]:after:h-2 [&.router-link-active]:after:rounded [&.router-link-active]:after:bg-primary-400"
            :to="item.path"
            >{{ item.name }}</RouterLink
          >
        </li>

        <li id="menudropdown" v-show="dropdownItems.length > 0">
          <PopoverMenu align="right" width="15rem">
            <button
              class="flex items-center gap-2 border-x border-grey-300 px-4 py-4 outline-none hover:bg-grey-200 focus-visible:rounded focus-visible:ring-1 focus-visible:ring-black"
            >
              More
              <ChevronDownIcon
                class="h-5 w-5 transition-all group-data-[headlessui-state=open]:-rotate-180"
              />
            </button>
            <template #items>
              <MenuGroup>
                <PopoverItem
                  v-for="item in dropdownItems"
                  routerLink
                  :path="item.path"
                  :key="item.id"
                >
                  {{ item.name }}
                </PopoverItem>
              </MenuGroup>
            </template>
          </PopoverMenu>
        </li>
      </ul>
    </nav>
    <Dialog as="div" class="sm:hidden" @close="mobileNavOpen = false" :open="mobileNavOpen">
      <div class="fixed inset-0 bg-black/75" aria-hidden="true" @click="mobileNavOpen = false" />
      <DialogPanel
        class="fixed inset-y-0 left-0 z-10 w-full max-w-sm overflow-y-auto bg-white py-5 shadow-md shadow-black/10"
      >
        <div class="flex items-center justify-between px-5">
          <RouterLink
            to="/"
            class="rounded font-accent text-3xl font-semibold outline-none hover:opacity-95 focus-visible:ring-2 focus-visible:ring-black max-sm:text-xl sm:hidden"
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
          <li v-for="item in navItems" :key="item.id">
            <RouterLink
              class="relative block w-full px-5 py-4 outline-none hover:bg-grey-200 focus-visible:rounded focus-visible:inner-border focus-visible:inner-border-black [&.router-link-active]:font-semibold [&.router-link-active]:after:absolute [&.router-link-active]:after:inset-y-0 [&.router-link-active]:after:left-0 [&.router-link-active]:after:block [&.router-link-active]:after:w-2 [&.router-link-active]:after:rounded [&.router-link-active]:after:bg-primary-400"
              :to="item.path"
              @click="mobileNavOpen = false"
              >{{ item.name }}</RouterLink
            >
          </li>
        </ul>
      </DialogPanel>
    </Dialog>
  </div>
</template>