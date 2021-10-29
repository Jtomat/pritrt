<template>
  <form @submit.prevent="submit">
    <h1 class="h3 mb-3 fw-normal">Please sign in</h1>

    <div class="form-floating">
      <input
        v-model="data.email"
        type="email"
        class="form-control"
        placeholder="name@example.com"
        required
      />
      <label>Email address</label>
    </div>
    <div style="margin-top: 10px" class="form-floating mb-3">
      <input
        v-model="data.password"
        type="password"
        class="form-control"
        placeholder="Password"
        required
      />
      <label>Password</label>
    </div>
    <p>
      Ещё нет аккаунта
      <router-link
        style="color: dodgerblue; text-decoration: underline"
        to="/Register"
        >зарегистрируйтесь</router-link
      >
    </p>

    <button class="w-100 btn btn-lg btn-primary" type="submit">Войти</button>
  </form>
</template>

<script>
import { AuthClient } from "@/http-clients/auth-client";
import { reactive } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "login-component",
  setup() {
    const auth = new AuthClient();
    const data = reactive({
      email: "",
      password: "",
    });

    const router = useRouter();

    const submit = async () => {
      await auth.login(data.email, data.password);
      await router.push("/");
    };

    return { data, submit };
  },
};
</script>

<style scoped></style>
