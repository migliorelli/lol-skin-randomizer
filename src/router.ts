import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import ChampionView from "./views/ChampionView.vue";
import HomeView from "./views/HomeView.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/:id",
    name: "champion",
    component: ChampionView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
