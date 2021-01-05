import Vue from "vue";
import Vuex from "vuex";

import * as fb from "../firebase";
import router from "../router/index";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userProfile: {},
    isAuth: false,
    workoutCollection: {},
  },
  plugins: [createPersistedState()],
  mutations: {
    setUserProfile(state, val) {
      state.isAuth = !state.isAuth;
      state.userProfile = val;
    },
    setworkoutCollection(state, val) {
      state.workoutCollection = val;
    },
  },
  actions: {
    async register({ dispatch }, form) {
      //sign up user
      const { user } = await fb.auth.createUserWithEmailAndPassword(
        form.email,
        form.password
      );

      //create user profile object
      await fb.usersCollection.doc(user.uid).set({
        name: form.name,
      });

      // fetch user profile
      dispatch("fetchUserProfile", user);
    },

    async login({ dispatch }, form) {
      //sign in user
      const { user } = await fb.auth.signInWithEmailAndPassword(
        form.email,
        form.password
      );

      // fetch user profile
      dispatch("fetchUserProfile", user);
    },

    async fetchUserProfile({ commit }, user) {
      //fetch user profile
      const userProfile = await fb.usersCollection.doc(user.uid).get();

      //set user profile
      commit("setUserProfile", userProfile.data());

      //change route or redirect
      router.push("/dashboard");
    },
    async logout({ commit }) {
      await fb.auth.signOut();
      commit("setUserProfile", {});
      router.push("/");
    },

    async fetchWorkoutCollection({ commit }) {
      //fetch workout collection
      const workoutCollection = await fb.workoutCollection.orderBy('createdWhen', "desc").get();

      const sanitizedWorkoutCollection = [];

      // TODO: hack to get around error of mutating the firebase data workoutCollection
      workoutCollection.forEach( async (each) => {
        let doc = each.data()

        const userProfile = await fb.usersCollection.doc(doc.userId).get();
        doc.createdWho = userProfile.data().name;
        doc.createdWhen = doc.createdWhen.toDate();
        sanitizedWorkoutCollection.push(doc)
      });

      //set workout collection
      commit("setworkoutCollection", sanitizedWorkoutCollection);
    },
  },
  getters: {
    ifIsAuth: (state) => state.isAuth,
  },
  modules: {},
});
