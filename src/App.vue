<template>
  <v-app>
    <v-app-bar app color="pink darken-3" flat>
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

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from "vuex";
import Dashboard from './views/Dashboard';
export default {
  name: "App",
  data: () => ({
    //
  }),
  computed: {
    ...mapState(['isAuth']),
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
    },
  },
};
</script>
