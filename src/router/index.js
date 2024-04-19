// #region -IMPORTS-
// Vue-related imports
import { createRouter, createWebHistory } from "vue-router";

// Custom module/helper imports
import { ProfileStateManager } from "@/helper/ProfileStateManager";
import { HistoryStack } from "@/helper/HistoryStack";
import { AuthStateManager } from "@/helper/AuthStateManager";

// Constants imports
import { categories } from "@/consts/navItems";

// Custom views
import HomeView from "../views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import ListView from "@/views/ListView.vue";
import AuctionView from "@/views/AuctionView.vue";
import HistoryView from "@/views/HistoryView.vue";
import ProfileView from "@/views/ProfileView.vue";
import AuctionFormView from "@/views/AuctionFormView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
// #endregion

const router = createRouter({
  scrollBehavior(to, from) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth"
      };
    } else if (
      to.name === "history" &&
      from.name === "history" &&
      (to.params.view === "all" || to.params.view === "wins")
    ) {
      return;
    } else if (
      to.name === "profile" &&
      from.name === "profile" &&
      (to.params.view === "all" || to.params.view === "active")
    ) {
      return;
    } else {
      return { top: 0 };
    }
  },

  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        title: "BidQuest",
        metaTags: [
          {
            name: "description",
            content:
              "Welcome to BidQuest - your ultimate destination for online auctions. Explore a wide range of items and start bidding today!"
          }
        ]
      }
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: {
        guest: true,

        title: "Login - BidQuest",
        metaTags: [
          {
            name: "description",
            content:
              "Log in to your BidQuest account and start bidding on your favorite items. Join our vibrant community today!"
          }
        ]
      }
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
      meta: {
        guest: true,
        title: "Register - BidQuest",
        metaTags: [
          {
            name: "description",
            content:
              "Create your BidQuest account and unlock access to exciting auctions. Sign up now and start bidding!"
          }
        ]
      }
    },
    {
      path: "/search/:query/:page(page-\\d+)?",
      name: "search",
      component: ListView,
      meta: {
        title: "Search: [:query] - BidQuest",
        metaTags: [
          {
            name: "description",
            content:
              "Find what you're looking for with BidQuest's powerful search feature. Explore a wide variety of items matching your query and place your bids!"
          }
        ]
      }
    },
    {
      path: "/auctions",
      children: [
        {
          path: ":page(page-\\d+)?",
          name: "auctions",
          component: ListView,
          meta: {
            title: "All Auctions - BidQuest",
            metaTags: [
              {
                name: "description",
                content:
                  "Discover a vast selection of auctions on BidQuest. Browse through different categories, find your interests, and place your bids to win!"
              }
            ]
          }
        },

        {
          path: ":category/:page(page-\\d+)?",
          name: "category",
          component: ListView,
          beforeEnter(to) {
            const exists = to.name === "category" && categories.includes(to.params.category);
            if (!exists) {
              return {
                name: "404",
                params: { pathMatch: to.path.split("/").slice(1), query: to.query, hash: to.hash }
              };
            }
          },
          meta: {
            title: "[:category] - BidQuest",
            metaTags: [
              {
                name: "description",
                content:
                  "Explore auctions in this category on BidQuest. Find unique items, participate in bidding, and seize the opportunity to win!"
              }
            ]
          }
        }
      ]
    },
    {
      path: "/auction",
      children: [
        {
          path: "create",
          name: "create",
          component: AuctionFormView,
          props: { mode: "create" },
          meta: {
            requiresAuth: true,
            title: "Create Auction - BidQuest",
            metaTags: [
              {
                name: "description",
                content:
                  "Start selling your items on BidQuest by creating an auction. Set your terms, attract bidders, and maximize your earnings!"
              }
            ]
          }
        },
        {
          path: ":id",
          name: "auction",
          component: AuctionView,
          meta: {
            title: "Auction - BidQuest",
            metaTags: [
              {
                name: "description",
                content:
                  "View details and participate in this auction on BidQuest. Place your bids and compete with others to secure your desired item!"
              }
            ]
          }
        },
        {
          path: ":id/edit",
          name: "edit",
          component: AuctionFormView,
          props: { mode: "edit" },
          meta: {
            requiresAuth: true,
            title: "Edit Auction - BidQuest",
            metaTags: [
              {
                name: "description",
                content:
                  "Modify your auction details on BidQuest. Update item information and optimize your auction to attract more bidders!"
              }
            ]
          }
        }
      ]
    },
    {
      path: "/profile/:username",
      meta: {
        requiresAuth: true,
        title: "[:username] - BidQuest",
        metaTags: [
          {
            name: "description",
            content: "View this profile on BidQuest. Explore their auctions!"
          }
        ]
      },
      children: [
        {
          path: ":view(active|all)?",
          name: "profile",
          component: ProfileView
        },
        {
          path: "history/:view(wins|all)?",
          name: "history",
          component: HistoryView,
          meta: {
            title: "Bid History - BidQuest",
            metaTags: [
              {
                name: "description",
                content:
                  "Review your bidding history on BidQuest. See your past wins, monitor your bidding activity, and enhance your auction strategy"
              }
            ]
          }
        }
      ]
    },
    {
      name: "404",
      path: "/:pathMatch(.*)*",
      component: NotFoundView,
      meta: {
        title: "Page Not Found - BidQuest",
        metaTags: [
          {
            name: "description",
            content:
              "Oops! The page you're looking for doesn't exist on BidQuest. Explore our site and discover exciting auctions!"
          }
        ]
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  // Set profile on route if authenticated
  if (AuthStateManager.isAuthenticated()) {
    ProfileStateManager.update();
  }

  // Redirection history
  if (from.name !== "login" && from.name !== "register") {
    HistoryStack.update(from.fullPath);
  }

  if (from.name === "home" || to.name === "home") {
    HistoryStack.clear();
  }

  // Auth guards
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!AuthStateManager.isAuthenticated()) {
      return next({
        name: "login",
        query: { redirect: to.fullPath }
      });
    } else {
      return next();
    }
  } else if (to.matched.some((record) => record.meta.guest)) {
    if (AuthStateManager.isAuthenticated()) {
      return next({
        name: "home",
        query: { redirect: to.fullPath }
      });
    } else {
      return next();
    }
  } else {
    return next();
  }
});

router.afterEach((to) => {
  let pageTitle;
  if (to.meta.title.includes("[:")) {
    const param = to.meta.title.split("[:")[1].split("]")[0];
    pageTitle = `${to.params[param].charAt(0).toUpperCase() + to.params[param].slice(1)} - BidQuest`;
  } else {
    pageTitle = to.meta.title;
  }
  document.title = pageTitle;

  // Remove old meta description
  const oldMeta = document.querySelector('meta[name="description"]');
  if (oldMeta) {
    document.head.removeChild(oldMeta);
  }

  // Add new meta description
  const descriptionTag = document.createElement("meta");
  descriptionTag.name = "description";
  descriptionTag.content = to.meta.metaTags.find((tag) => tag.name === "description").content;
  document.head.appendChild(descriptionTag);
});

export default router;
