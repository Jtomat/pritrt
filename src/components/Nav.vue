<template>
  <header class="p-3 bg-dark text-white">
    <div class="container">
      <div
        style="align-content: start"
        class="
          d-flex
          flex-wrap
          align-items-center
          justify-content-center justify-content-lg-start
        "
      >
        <a
          href="/"
          class="
            d-flex
            align-items-center
            mb-2 mb-lg-0
            text-white text-decoration-none
          "
        >
          <div style="display: flex; flex-direction: row">
            <div class="ico"></div>
            <routerLink to="/" class="te">UnSleepingEye</routerLink>
          </div>
        </a>

        <ul
          class="
            nav
            col-12 col-lg-auto
            me-lg-auto
            mb-2
            justify-content-center
            mb-md-0
          "
        >
          <li>
            <routerLink to="/" class="nav-link px-2 text-secondary"
              >Главная</routerLink
            >
          </li>
          <li v-if="data.auth && data.auth.value">
            <routerLink
              to="/projects"
              href="#"
              class="nav-link px-2 text-secondary"
              >Проекты</routerLink
            >
          </li>
          <li v-if="data.auth && data.auth.value">
            <routerLink
              to="/tasks"
              href="#"
              class="nav-link px-2 text-secondary"
              >Задачи</routerLink
            >
          </li>
          <li v-if="data.auth && data.auth.value">
            <routerLink
              to="/resources"
              href="#"
              class="nav-link px-2 text-secondary"
              >Ресурсы</routerLink
            >
          </li>
          <li v-if="data.auth && data.auth.value">
            <routerLink
              to="/results"
              href="#"
              class="nav-link px-2 text-secondary"
              >Отчёт</routerLink
            >
          </li>
        </ul>

        <!--<form class="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3">
          <input
            type="search"
            class="form-control form-control-dark"
            placeholder="Search..."
            aria-label="Search"
          />
        </form>-->

        <div class="text-end">
          <div v-if="!(data.auth && data.auth.value)">
            <router-link to="/Login">
              <button type="button" class="btn btn-outline-light me-2">
                Войти
              </button>
            </router-link>
            <router-link to="/Register">
              <button type="button" class="btn btn-warning">
                Зарегистрироватся
              </button>
            </router-link>
          </div>
          <div
            v-if="data.auth && data.auth.value && data.user && data.user.value"
          >
            <avatar :shape="'circle'" :type="'icon'" style="margin-right: 5px">
              {{ data.user.value.name }}
            </avatar>
            <button type="button" v-on:click="exit()" class="btn btn-warning">
              Выйти
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { Avatar } from "@progress/kendo-vue-layout";
import { useStore } from "vuex";
import { computed } from "vue";
import { AuthClient } from "@/http-clients/auth-client";
import { useRouter } from "vue-router";
export default {
  name: "Navigation",
  components: {
    avatar: Avatar,
  },
  setup() {
    const store = useStore();
    const data = {};
    const router = useRouter();
    data.auth = computed(() => store.getters.isAuth);
    if (data.auth) {
      data.user = computed(() => store.getters.getUser);
    }

    const exit = () => {
      const auth = new AuthClient();
      auth.logOut(store);
      router.push("/");
    };
    return { data, exit };
  },
  computed: {
    currentRoute() {
      console.log(this.$router.currentRoute.path);
      return this.$router.currentRoute.path;
    },
  },
};
</script>
<style scoped>
.router-link-active {
  color: #ffc107 !important;
}
.ico {
  margin: 8px;
  background: url("../../public/Eye.webp");
  background-size: cover;
  width: 40px;
  height: 40px;
  padding-left: 40px;
  color: white;
  font-size: 20pt;
}
.te {
  font-family: Oxanium;
  margin: 8px;
  margin-top: 10px;
  margin-right: 100px;
  font-size: 25px;
  text-decoration: none;
  color: white;
}
</style>
