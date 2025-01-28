import { createApp } from "vue";
import App from "./App.vue";
import clickOutside from "./directives/clickOutside";
import tooltip from "./directives/tooltip";
import CDNVersionPlugin from "./plugins/CDNVersionPlugin";
import router from "./router";
import "./style.css";

const app = createApp(App);

app.use(CDNVersionPlugin);
app.use(router);

app.directive("click-outside", clickOutside);
app.directive("tooltip", tooltip);

app.mount("#app");
