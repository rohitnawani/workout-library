<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <h1>Hi, {{ userProfile.name }}</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <WorkoutForm />
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

      <v-col cols="12" sm="1">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              color="pink"
              v-bind="attrs"
              v-on="on"
              @click="toggleView"
            >
              <v-icon v-if="!listView">mdi-view-list</v-icon>
              <v-icon v-else>mdi-card-text-outline</v-icon>
            </v-btn>
          </template>
          <span v-if="!listView">Change to List View</span>
          <span v-else>Change to Tile View</span>
        </v-tooltip>
      </v-col>
    </v-row>

    <template v-if="listView">
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
            :items="workoutCollection"
            :expanded.sync="expanded"
            :search="search"
            item-key="title"
            show-expand
            class="elevation-1"
            :items-per-page="itemsPerPage"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>Workout Table</v-toolbar-title>
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
                <template v-for="line in item.description.split('\n')"
                  >{{ line }}<br
                /></template>
              </td>
            </template>
          </v-data-table>
        </template>
      </v-card>
    </template>

    <v-data-iterator
      v-else
      :items="workoutCollection"
      item-key="name"
      :items-per-page="itemsPerPage"
    >
      <template v-slot:default="{ items }">
        <v-row>
          <v-col
            v-for="item in items"
            :key="item.title"
            cols="12"
            sm="12"
            md="6"
            lg="4"
          >
            <v-card>
              <v-card-title>
                <h4>{{ item.title }}</h4>
              </v-card-title>
              <v-divider></v-divider>
              <v-list dense>
                <v-list-item>
                  <v-list-item-content>Description:</v-list-item-content>
                  <v-list-item-content class="align-end">
                    <template v-for="line in item.description.split('\n')"
                      >{{ line }}<br
                    /></template>
                  </v-list-item-content>
                </v-list-item>

                <v-expansion-panels>
                  <v-expansion-panel>
                    <v-expansion-panel-header>
                      More Information
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-list-item v-if="item.reference">
                        <v-list-item-content>Reference:</v-list-item-content>
                        <v-list-item-content class="align-end">
                          <a v-bind:href="item.reference" target="_blank">
                            {{ item.reference }}
                          </a>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>Uploaded by:</v-list-item-content>
                        <v-list-item-content class="align-end">
                          {{ item.createdWho }}
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>Uploaded at:</v-list-item-content>
                        <v-list-item-content class="align-end">
                          {{ item.createdWhen }}
                        </v-list-item-content>
                      </v-list-item>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import WorkoutForm from "@/components/WorkoutForm";
export default {
  components: {
    WorkoutForm,
  },
  data() {
    return {
      // if list View === false -> card view
      itemsPerPage: 15,
      listView: true,
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
    ...mapState(["userProfile", "workoutCollection"]),
  },
  watch: {
    expandAll(newValue) {
      this.expanded = newValue ? this.$store.state.workoutCollection : [];
    },
    expanded(newValue) {
      if (newValue.length === 0) {
        this.expandAll = false;
      }
    },
  },
  methods: {
    refreshData() {
      this.$store.dispatch("fetchWorkoutCollection");
      this.$store.dispatch("fetchTagsCollection");
    },
    toggleView() {
      this.listView = !this.listView;
    },
    getTagsColor(tag) {
      return this.$store.state.allExistingTags.find((o) => o.name === tag)
        .color;
    },
  },
};
</script>
