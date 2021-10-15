import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Navigation from "@/components/Nav.vue";
import Login from "@/components/login-component.vue";
import Register from "@/components/register-component.vue";
import Bottom from "@/components/bottom-component.vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

const app = createApp(App);
app.use(store);
app.use(router);
app.component("Navigation", Navigation);
app.component("Login", Login);
app.component("Register", Register);
app.component("Bottom", Bottom);
const mounted = app.mount("#app");
