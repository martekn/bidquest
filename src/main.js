import "./assets/main.css";

// #region -IMPORTS-
// Vue-related imports
import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";

// Third-party library imports
import Notifications from "notiwind";

// Custom components
import { AuthStateManager } from "@/helper/AuthStateManager";
// #endregion

const app = createApp(App);

app.use(router);
app.use(Notifications);
app.mount("#app");

window.addEventListener("storage", (e) => {
  if (e.key === "accessToken") {
    AuthStateManager.token = e.newValue;
  }
});
