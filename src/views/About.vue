<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="white" dark v-bind="attrs" v-on="on" class="pink--text">
          What is Thiccumary?
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="headline pink darken-3">
          What is Thiccumary?
        </v-card-title>

        <v-card-text>
          <br>
          Thiccumary is a beautiful Thiccum library of workouts collected or
          developed by my beautiful friends. 
          <br>
          <br>
          
          <a href="/Login">Log In</a> to find out more!
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false">
            Cool
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
    };
  },
};
</script>
