import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import ListView from "@/views/ListView.vue";
import AuctionView from "@/views/AuctionView.vue";
import HistoryView from "@/views/HistoryView.vue";
import ProfileView from "@/views/ProfileView.vue";
import AuctionFormView from "@/views/AuctionFormView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import { categories } from "@/consts/navItems";
import { HistoryStack } from "@/helper/HistoryStack";
import { AuthStateManager } from "@/helper/AuthStateManager";
import { ProfileStateManager } from "@/helper/ProfileStateManager";

const router = createRouter({
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth"
      };
    } else {
      return { el: "body" };
    }
  },
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
          component: ListView,
          beforeEnter(to) {
            const exists = to.name === "category" && categories.includes(to.params.category);
            if (!exists) {
              return {
                name: "404",
                params: { pathMatch: to.path.split("/").slice(1), query: to.query, hash: to.hash }
              };
            }
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
          meta: { requiresAuth: true }
        },
        {
          path: ":id",
          name: "auction",
          component: AuctionView
        },
        {
          path: ":id/edit",
          name: "edit",
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
          path: ":view(active|ended)?",
          name: "profile",
          component: ProfileView
        },
        {
          path: "history/:view?",
          name: "history",
          component: HistoryView
        }
      ]
    },
    {
      name: "404",
      path: "/:pathMatch(.*)*",
      component: NotFoundView
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (AuthStateManager.isAuthenticated()) {
    ProfileStateManager.update();
  }

  if (from.name !== "login" && from.name !== "register") {
    HistoryStack.update(from.fullPath);
  }

  if (from.name === "home" || to.name === "home") {
    HistoryStack.clear();
  }

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

export default router;
