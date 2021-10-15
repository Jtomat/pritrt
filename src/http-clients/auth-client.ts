import { $authHost } from "./clients/index";
import jwt_decode from "jwt-decode";
import { useStore } from "vuex";
import { UserModel } from "../store";

export class AuthClient {
  store = useStore();
  _api = "/au/";
  async register(email, name, password) {
    const { data } = await $authHost.post<any>(this._api + "registration", {
      email,
      name,
      password,
    });
    await this.store.dispatch("setAuth", true);
    await this.store.dispatch("setUser", {
      id: data.id,
      name: data.name,
      email: email,
      password: password,
      token: data.access_token,
    });
    return jwt_decode(data.access_token);
  }

  async login(email, password) {
    const { data } = await $authHost.post<any>(this._api + "login", {
      email,
      password,
    });
    await this.store.dispatch("setAuth", true);
    await this.store.dispatch("setUser", {
      id: data.id,
      name: data.name,
      email: email,
      password: password,
      token: data.access_token,
    });
    return jwt_decode(data.access_token);
  }

  async update() {
    const user: UserModel = this.store.getters.getUser;
    return this.login(user.email, user.password);
  }

  async logOut(store) {
    await store.dispatch("setAuth", false);
    await store.dispatch("setUser", null);
    return 1;
  }
}
