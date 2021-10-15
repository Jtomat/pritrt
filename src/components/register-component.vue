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

    <div class="form-floating">
      <input
        v-model="data.name"
        type="text"
        class="form-control"
        placeholder="User name"
        required
      />
      <label>User name</label>
    </div>

    <div class="form-floating mb-3">
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
      Уже есть аккаунт
      <router-link
        style="color: dodgerblue; text-decoration: underline"
        to="/Login"
        >войдите</router-link
      >
    </p>

    <button class="w-100 btn btn-lg btn-primary" type="submit">
      Зарегистрироваться
    </button>
  </form>
</template>

<script lang="ts">
import { reactive } from "vue";
import { AuthClient } from "../http-clients/auth-client";
import { useRouter } from "vue-router";
export default {
  name: "register-component",
  setup() {
    const auth = new AuthClient();
    const data = reactive({
      name: "",
      email: "",
      password: "",
    });

    const router = useRouter();

    const submit = async () => {
      await auth.register(data.email, data.name, data.password);
      await router.push("/");
    };

    return { data, submit };
  },
};
</script>

<style scoped></style>
