import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import ListView from "@/views/ListView.vue";
import AuctionView from "@/views/AuctionView.vue";
import HistoryView from "@/views/HistoryView.vue";
import ProfileView from "@/views/ProfileView.vue";
import AuctionFormView from "@/views/AuctionFormView.vue";

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
      component: LoginView
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView
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
          props: { mode: "create" }
        },
        {
          path: ":id",

          name: "auction detail",
          component: AuctionView
        },
        {
          path: ":id/edit",
          name: "auction edit",
          component: AuctionFormView
        }
      ]
    },
    {
      path: "/profile/:username",
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

export default router;
