<template>
  <v-app>
    <v-app-bar app color="pink darken-3" flat>
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      <v-btn to="/" text> Thiccumary </v-btn>
      <v-spacer> </v-spacer>
      <div v-if="!isAuth">
        <v-btn :to="{ name: 'Login' }" text> Login </v-btn>
        <v-btn :to="{ name: 'Register' }" text> Register </v-btn>
      </div>
      <div v-else>
        <v-btn @click="logout" text> Logout </v-btn>
      </div>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" fixed temporary>
      <v-list nav dense>
        <v-list-item-group
          v-model="group"
          active-class="deep-pink--text text--accent-4"
        >
          <v-list-item to="/">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>

          <v-list-item to="/">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Account</v-list-item-title>
          </v-list-item>

          <v-list-item to="/workout-dashboard">
            <v-list-item-icon>
              <v-icon>mdi-desktop-mac-dashboard</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Workout Dashboard</v-list-item-title>
          </v-list-item>

          <v-list-item to="/exercise-dashboard">
            <v-list-item-icon>
              <v-icon>mdi-desktop-mac-dashboard</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Exercise Dashboard</v-list-item-title>
          </v-list-item>

          <v-list-item to="/why-not">
            <v-list-item-icon>
              <v-icon>mdi-help</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Why not</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "App",
  data: () => ({
    drawer: false,
    group: null,
  }),
  computed: {
    ...mapState(["isAuth"]),
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
    },
  },
};
</script>
