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
    allExistingTags: [],
  },
  plugins: [createPersistedState()],
  mutations: {
    setUserProfile(state, val) {
      state.userProfile = val;
    },
    setIsAuth(state) {
      state.isAuth = !state.isAuth;
    },
    setworkoutCollection(state, val) {
      state.workoutCollection = val;
    },
    setAllExistingTags(state, val) {
      state.allExistingTags = val;
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
      //reset IsAuth
      commit("setIsAuth");

      //change route or redirect
      router.push("/dashboard");
    },
    async logout({ commit }) {
      await fb.auth.signOut();
      commit("setUserProfile", {});
      commit("setIsAuth");
      router.push("/");
    },
    async fetchWorkoutCollection({ commit }) {
      //fetch workout collection
      const workoutCollection = await fb.workoutCollection
        .orderBy("createdWhen", "desc")
        .get();

      const sanitizedWorkoutCollection = [];

      // TODO: hack to get around error of mutating the firebase data workoutCollection
      workoutCollection.forEach(async (each) => {
        let doc = each.data();

        const userProfile = await fb.usersCollection.doc(doc.userId).get();
        doc.createdWho = userProfile.data().name;
        doc.createdWhen = doc.createdWhen.toDate().toLocaleString("en-GB", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        sanitizedWorkoutCollection.push(doc);
      });
      //set workout collection
      commit("setworkoutCollection", sanitizedWorkoutCollection);
    },

    async fetchTagsCollection({ commit }) {
      // fetch tags collection
      // TODO: this is cumbersome AF, figure out how to directly retreive data from firebase
      const tagsCollection = await fb.tagsCollection.get();
      const tags = [];
      tagsCollection.forEach((each) => tags.push(each.data()));
      commit("setAllExistingTags", tags);
    },
  },
  getters: {
    ifIsAuth: (state) => state.isAuth,
    getTags: (state) => state.allExistingTags.map((tag) => tag.name),
  },
  modules: {},
});
