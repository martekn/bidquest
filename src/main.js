import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Notifications from "notiwind";

const app = createApp(App);

app.use(router);
app.use(Notifications);
app.mount("#app");
