import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import ListView from "@/views/ListView.vue";
import AuctionView from "@/views/AuctionView.vue";
import HistoryView from "@/views/HistoryView.vue";
import ProfileView from "@/views/ProfileView.vue";
import AuctionFormView from "@/views/AuctionFormView.vue";

import { HistoryStack } from "@/helper/HistoryStack";
import { isAuthenticated } from "@/helper/isAuthenticated";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: { guest: true }
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
      meta: { guest: true }
    },
    {
      path: "/search/:query/:page(page-\\d+)?",
      name: "search",
      component: ListView
    },
    {
      path: "/auctions",
      children: [
        {
          path: ":page(page-\\d+)?",
          name: "auctions",
          component: ListView
        },
        {
          path: ":category/:page(page-\\d+)?",
          name: "category",
          component: ListView
        }
      ]
    },
    {
      path: "/auction",
      children: [
        {
          path: "create",
          component: AuctionFormView,
          props: { mode: "create" },
          meta: { requiresAuth: true }
        },
        {
          path: ":id",

          name: "auction detail",
          component: AuctionView
        },
        {
          path: ":id/edit",
          name: "auction edit",
          component: AuctionFormView,
          props: { mode: "edit" },
          meta: { requiresAuth: true }
        }
      ]
    },
    {
      path: "/profile/:username",
      meta: { requiresAuth: true },
      children: [
        {
          path: ":view?",
          name: "profile",
          component: ProfileView
        },
        {
          path: "history/:view?",
          name: "history",
          component: HistoryView
        }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (from.name !== "login" && from.name !== "register") {
    HistoryStack.update(from.fullPath);
  }

  if (from.name === "home" || to.name === "home") {
    HistoryStack.clear();
  }

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated()) {
      next({
        path: "/login",
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else if (to.matched.some((record) => record.meta.guest)) {
    if (isAuthenticated()) {
      next({
        path: "/",
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
