import { createApp } from "vue";
import App from "./App.vue";
import clickOutside from "./directives/clickOutside";
import CDNVersionPlugin from "./plugins/CDNVersionPlugin";
import router from "./router";
import "./style.css";

const app = createApp(App);

app.use(CDNVersionPlugin);
app.use(router);

app.directive("click-outside", clickOutside);

app.mount("#app");
