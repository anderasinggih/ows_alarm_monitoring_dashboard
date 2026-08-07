import { createRouter, createWebHashHistory } from "vue-router";
import Netdrone from '../views/Page/index.vue';
import Dummy from '../views/Page/dummy.vue';
const router = createRouter({
  history: createWebHashHistory(),   // hash
  routes: [
    {
      path: "/",
      name: "netdrone",
      component: Netdrone
    },
    {
      path: "/dummy",
      name: "dummy",
      component: Dummy
    },
  ]
});

export default router;