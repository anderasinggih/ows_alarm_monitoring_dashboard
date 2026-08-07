import { createApp } from "vue";
import { U } from "@adc/vigour-ui/lib/spl";
import { initDirectives } from "../directives";
import { initComponents } from "../components";
import { initStore } from "../store";
import common from "@adc/vigour-ui/lib/common"

import App from "./app";
import router from "../router";
import VueSweetalert2 from 'vue-sweetalert2';

import "@adc/vigour-ui/lib/style/core.css";
import "../assets/style/theme/default.css";
import 'sweetalert2/dist/sweetalert2.min.css';
import 'vue-multiselect/dist/vue-multiselect.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

U.loadCurrentTheme().then(() => {
  let theme = U.getCurrentThemeName();
  if (theme && theme !== "light") {
    let id = "demo-theme-style";
    let styleTag = document.getElementById(id);
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.setAttribute("id", id);
      document.body.appendChild(styleTag);
    }
    styleTag.innerText = import(`../assets/style/theme/${theme}.css`);
  }
});

const i18n = U.initI18n();

const app = createApp(App);

const sweetAlertStyle = {
  confirmButtonColor: '#f25a66',
  cancelButtonColor: '#f25a66',
}

app.use(i18n)
  .use(router)
  .use(ElementUI)
  .use(VueSweetalert2,sweetAlertStyle);

initComponents(app);
initDirectives(app);
initStore(app);

// app.mount("#app");
common.loadUserConfig().then(() => {
  app.mount("#app");
});