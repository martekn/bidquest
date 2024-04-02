import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { AuthStateManager } from "./helper/AuthStateManager";

const app = createApp(App);

app.use(router);
app.mount("#app");

window.addEventListener("storage", (e) => {
  if (e.key === "accessToken") {
    AuthStateManager.token = e.newValue;
  }
});
