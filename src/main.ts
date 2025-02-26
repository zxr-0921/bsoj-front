import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import ArcoVue from "@arco-design/web-vue";
import "@arco-design/web-vue/dist/arco.css";
import router from "./router";
import "@/plugins/axios";
import "@/access";
import "bytemd/dist/index.css";
// 额外引入图标库
import ArcoVueIcon from "@arco-design/web-vue/es/icon";
// 持久化插件
import piniaPersist from "pinia-plugin-persist";

const pinia = createPinia();
pinia.use(piniaPersist);
createApp(App)
  .use(ArcoVue)
  .use(ArcoVueIcon)
  .use(router)
  .use(pinia)
  .mount("#app");
