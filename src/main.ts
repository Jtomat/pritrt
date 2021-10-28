import { createApp } from "vue";
import "bootstrap/dist/css/bootstrap.css";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Navigation from "@/components/Nav.vue";
import Login from "@/components/login-component.vue";
import Register from "@/components/register-component.vue";
import Bottom from "@/components/bottom-component.vue";
import Vue3Material from "vue3-material";
import "@progress/kendo-ui";
import "@progress/kendo-ui/js/cultures/kendo.culture.ru-RU";
import { DateinputsInstaller } from "@progress/kendo-dateinputs-vue-wrapper";

kendo.culture("ru-RU");

const app = createApp(App);
app.use(store);
app.use(DateinputsInstaller);
app.use(router);
app.use(Vue3Material);
app.component("Navigation", Navigation);
app.component("Login", Login);
app.component("Register", Register);
app.component("Bottom", Bottom);
const mounted = app.mount("#app");
