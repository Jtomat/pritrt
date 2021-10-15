import { Commit, createStore } from "vuex";

import { useStore } from "vuex";

export interface UserModel {
  id: number;
  name: string;
  email: string;
  token: string;
  password: string;
}

export default createStore({
  state: {
    user: {} as UserModel,
    auth: false,
  },
  mutations: {
    SET_AUTH: (state: { auth: boolean; user: UserModel }, auth: boolean) =>
      (state.auth = auth),
    SET_USER: (state: { auth: boolean; user: UserModel }, user: UserModel) =>
      (state.user = user),
  },
  actions: {
    setAuth: ({ commit }: { commit: Commit }, auth: boolean) =>
      commit("SET_AUTH", auth),
    setUser: ({ commit }: { commit: Commit }, user: UserModel) =>
      commit("SET_USER", user),
  },
  getters: {
    getUser: (state): UserModel => {
      return state.user;
    },
    isAuth: (state): boolean => {
      return state.auth;
    },
  },
  modules: {},
});
