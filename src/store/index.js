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
    workoutCollection: [],
    exerciseCollection: [],
    tagsCollection: [],
    usersMap: {}, //key - ID, value - name
  },
  plugins: [createPersistedState()],
  mutations: {
    setUserProfile(state, val) {
      state.userProfile = val;
    },
    setIsAuth(state) {
      state.isAuth = !state.isAuth;
    },
    setWorkoutCollection(state, val) {
      state.workoutCollection = val;
    },
    setExerciseCollection(state, val) {
      state.exerciseCollection = val;
    },
    setTagsCollection(state, val) {
      state.tagsCollection = val;
    },
    setUsersMap(state, val) {
      state.usersMap = val;
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
      router.push("/workout-dashboard");
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

      let sanitizedWorkoutCollection = [];

      // TODO: hack to get around error of mutating the firebase data workoutCollection
      workoutCollection.forEach(async (each) => {
        let doc = each.data();
        doc.createdWhenDateFormat = doc.createdWhen.toDate();

        doc.createdWhen = doc.createdWhenDateFormat.toLocaleString("en-GB", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

        // const userProfile = await fb.usersCollection.doc(doc.userId).get();
        // doc.createdWho = userProfile.data().name;
        doc.createdWho = this.state.usersMap[doc.userId];
        sanitizedWorkoutCollection.push(doc);
      });

      // HACK: fb orderBy is not working for some reason so sorting manually as a hack
      const sortedSanitizedWorkoutCollection = sanitizedWorkoutCollection.sort(
        (a, b) =>
          new Date(b.createdWhenDateFormat) - new Date(a.createdWhenDateFormat)
      );

      //set workout collection
      commit("setWorkoutCollection", sortedSanitizedWorkoutCollection);
    },

    async fetchExerciseCollection({ commit }) {
      // fetch exercise collection
      const exerciseCollection = await fb.exerciseCollection
        .orderBy("createdWhen", "desc")
        .get();

      const sanitizedExerciseCollection = [];

      exerciseCollection.forEach(async (each) => {
        let doc = each.data();

        const userProfile = await fb.usersCollection.doc(doc.userId).get();
        doc.createdWho = userProfile.data().name;
        doc.createdWhen = doc.createdWhen.toDate().toLocaleString("en-GB", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        sanitizedExerciseCollection.push(doc);
      });
      // set exercise collection
      commit("setExerciseCollection", sanitizedExerciseCollection);
    },

    async fetchTagsCollection({ commit }) {
      // fetch tags collection
      // TODO: this is cumbersome AF, figure out how to directly retreive data from firebase
      const tagsCollection = await fb.tagsCollection.get();
      const tags = [];
      tagsCollection.forEach((each) => tags.push(each.data()));
      commit("setTagsCollection", tags);
    },
    async fetchUsersMap({ commit }) {
      // fetch users collection
      // TODO: this is cumbersome AF, figure out how to directly retreive data from firebase
      const usersCollection = await fb.usersCollection.get();
      const users = {};
      usersCollection.forEach((each) => {
        users[each.id] = each.data().name;
      });
      commit("setUsersMap", users);
    },
  },
  getters: {
    ifIsAuth: (state) => state.isAuth,
    getTags: (state) => state.tagsCollection.map((tag) => tag.name),
  },
  modules: {},
});
