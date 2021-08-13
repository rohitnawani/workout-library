<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <avataaar class="avatar-class"></avataaar>
      </v-col>
    </v-row>

    <v-row class="buttons-row">
      <v-col>
        <ExerciseForm />
      </v-col>

      <v-spacer></v-spacer>

      <v-col cols="12" sm="1">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              color="pink"
              v-bind="attrs"
              v-on="on"
              @click="refreshData"
            >
              <v-icon>mdi-cached</v-icon>
            </v-btn>
          </template>
          <span>Refresh Dashboard Data</span>
        </v-tooltip>
      </v-col>
    </v-row>

    <template>
      <v-card>
        <v-card-title>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <template>
          <v-data-table
            :headers="headers"
            :items="exerciseCollection"
            :expanded.sync="expanded"
            :search="search"
            item-key="title"
            show-expand
            class="elevation-1"
            :items-per-page="itemsPerPage"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>Exercise Table</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-switch
                  v-model="expandAll"
                  label="Expand"
                  class="mt-5"
                ></v-switch>
              </v-toolbar>
            </template>
            <template v-slot:item.tags="{ item }">
              <v-chip
                v-for="tag in item.tags"
                v-bind:key="tag"
                :color="getTagsColor(tag)"
                text-color="black"
              >
                {{ tag }}
              </v-chip>
            </template>

            <template v-slot:expanded-item="{ headers, item }">
              <td :colspan="headers.length">
                <div class="exerciseDescription">
                  <!-- comment this out for now so we don't run into split on null error -->
                  <!-- <template v-for="line in item.description.split('\n')"
                    >{{ line }}<br
                  /></template> -->
                </div>
              </td>
            </template>
          </v-data-table>
        </template>
      </v-card>
    </template>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import ExerciseForm from "@/components/ExerciseForm";
import Avataaar from "../components/avatar/Avataaar";

export default {
  components: {
    ExerciseForm,
    Avataaar,
  },
  created() {
    this.refreshData();
  },
  data() {
    return {
      // if list View === false -> card view
      itemsPerPage: 15,
      search: "",
      expanded: [],
      expandAll: false,
      headers: [
        {
          text: "Title",
          align: "start",
          filterable: true,
          value: "title",
        },
        { text: "Uploaded by user", value: "createdWho" },
        { text: "Date", value: "createdWhen" },
        { text: "Tags", filterable: true, value: "tags" },
      ],
    };
  },
  computed: {
    ...mapState(["userProfile", "exerciseCollection"]),
  },
  watch: {
    expandAll(newValue) {
      this.expanded = newValue ? this.$store.state.exerciseCollection : [];
    },
    expanded(newValue) {
      if (newValue.length === 0) {
        this.expandAll = false;
      }
    },
  },
  methods: {
    refreshData() {
      this.$store.dispatch("fetchExerciseCollection");
      this.$store.dispatch("fetchTagsCollection");
    },
    toggleView() {
      this.listView = !this.listView;
    },
    getTagsColor(tag) {
      return this.$store.state.tagsCollection.find((o) => o.name === tag).color;
    },
  },
};
</script>

<style scoped>
.exerciseDescription {
  margin-top: 1%;
  margin-bottom: 1%;
  margin-left: 1%;
  color: pink;
}
.buttons-row {
  margin-bottom: 1%;
}
.avatar-class {
  float: left;
  width: 10%;
}
</style>
