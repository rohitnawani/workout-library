<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <avataaar class="avatar-class"></avataaar>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col md="4">
        <v-card elevation="2">
          <v-card-title> Why not? </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-select
                v-model="category"
                :items="allTags"
                label="Select a Category"
                required
              ></v-select>

              <v-text-field
                v-model="number"
                :rules="numberRules"
                label="Number"
                outlined
                required
                @click:append="show = !show"
              >
              </v-text-field>

              <v-btn elevation="2" color="primary" @click="generate">
                Go
              </v-btn>

              <v-card-text>
                <div class="font-weight-black">
                  <p v-if="this.generatedWorkout">Generated Workout</p>
                </div>
                <template v-for="line in generatedWorkout"
                  >{{ line }}<br
                /></template>
              </v-card-text>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import Avataaar from "../components/avatar/Avataaar";

export default {
  components: {
    Avataaar,
  },
  data() {
    return {
      number: 0,
      category: "",
      valid: false,
      allTags: this.$store.getters.getTags,
      numberRules: [(v) => /[0-9]+/.test(v) || "Please enter a number"],
      generatedWorkout: null,
    };
  },
  computed: {
    ...mapState(["exerciseCollection"]),
  },
  created() {
    this.$store.dispatch("fetchExerciseCollection");
  },
  methods: {
    generate() {
      const valid = this.$refs.form.validate();
      var clonedArray = JSON.parse(
        JSON.stringify(this.$store.state.exerciseCollection)
      );

      var clonedFilteredArray = clonedArray.filter((each) => {
        return each.tags.includes(this.category);
      });

      // Shuffle array
      const shuffled = clonedFilteredArray.sort(() => 0.5 - Math.random());

      // Get sub-array of first n elements after shuffled
      let selected = shuffled.slice(0, this.number);
      this.generatedWorkout = selected.map((each) => each.title);
    },
  },
};
</script>

<style scoped>
.avatar-class {
  float: left;
  width: 10%;
}
</style>
