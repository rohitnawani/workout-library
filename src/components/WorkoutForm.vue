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

            <v-text-field v-model="reference" label="Reference Link" outlined>
            </v-text-field>

            <template>
              <v-combobox
                v-model="tags"
                :items="allTags"
                chips
                clearable
                label="Insert tags"
                multiple
              >
                <template v-slot:selection="{ attrs, item, select, selected }">
                  <v-chip
                    v-bind="attrs"
                    :input-value="selected"
                    close
                    @click="select"
                    @click:close="removeFromtags(item)"
                  >
                    <strong>{{ item }}</strong>
                  </v-chip>
                </template>
              </v-combobox>
            </template>

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
import { tagsCollection, workoutCollection, auth } from "../firebase";
import firebase from "firebase/app";
import * as randomColor from "randomcolor";

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
      tags: [],
      allTags: this.$store.getters.getTags,
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
          tags: this.tags,
          createdWhen: firebase.firestore.Timestamp.now(),
        };

        this.checkIfNewTags();
        await workoutCollection.add(data);

        await this.resetForm();
        this.isLoading = false;
        this.dialog = false;
      } catch (e) {
        console.log(e);
      }
    },
    checkIfNewTags() {
      // check if there are new tags,
      // if so, set new color + add to TagsCollection
      this.tags.forEach(async (tag) => {
        if (!this.allTags.includes(tag)) {
          const color = randomColor({ luminosity: "light" });
          let obj = { name: tag, color };
          await tagsCollection.add(obj);
        }
      });
    },
    async removeFromtags(item) {
      this.tags.splice(this.tags.indexOf(item), 1);
      this.tags = [...this.tags];
    },
  },
};
</script>
