<template>
  <div class="game-form">
    <v-btn @click="dialog = !dialog" color="primary"> Add new workout</v-btn>

    <v-dialog v-model="dialog" persistent width="600px">
      <v-card>
        <v-card-title> Add new workout </v-card-title>
        <v-card-text>
          <v-form v-model="valid" ref="form" lazy-validation>
            <v-text-field
              v-model="title"
              :rules="fieldRules"
              label="Workout Title"
              required
              outlined
            >
            </v-text-field>

            <v-textarea
              v-model="description"
              :rules="fieldRules"
              label="Workout Description"
              required
              outlined
            >
            </v-textarea>

            <v-text-field
              v-model="reference"
              label="Reference Link"
              outlined
            >
            </v-text-field>

            <!-- <v-file-input
              accept="image/*"
              label="File Input"
              v-model="file"
              show-size
            >
            </v-file-input> -->

            <v-btn
              elevation="2"
              color="primary"
              @click="addWorkout"
              :loading="isLoading"
            >
              Add
            </v-btn>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { workoutCollection, auth, storage } from "../firebase";
import firebase from 'firebase/app'


export default {
  name: "WorkoutForm",
  data() {
    return {
      isLoading: false,
      valid: false,
      dialog: false,
      title: "",
      description: "",
      reference: "",
      file: null,
      fieldRules: [(v) => !!v || "this field is required"],
    };
  },
  methods: {
    resetForm() {
      this.$refs.form.reset();
    },
    async addWorkout() {
      try {
        this.isLoading = false;
        this.dialog = false;

        // //upload file
        // const fileRef = "uploads/workout/" + this.file.name;
        // const snapshot = await storage.ref(fileRef).put(this.file);

        let data = {
          userId: auth.currentUser.uid,
          title: this.title,
          description: this.description,
          // image: fileRef,
          reference: this.reference,
          createdWhen: firebase.firestore.Timestamp.now(),
        };

        const doc = await workoutCollection.add(data);

        await this.resetForm();
        this.isLoading = false;
        this.dialog = false;
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>
