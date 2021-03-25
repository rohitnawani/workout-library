<template>
  <v-img
    :lazy-src="avatarURL"
    :src="avatarURL"
    @click="generateNewAvatar()"
  ></v-img>
</template>

<script>
import AvataaarMetadata from "./AvataaarMetadata";
import { mapState } from "vuex";
import { usersCollection } from "../../firebase";

export default {
  props: {
    avatarStyle: String,
    accessoriesType: String,
    clotheType: String,
    clotheColor: String,
    eyebrowType: String,
    eyeType: String,
    facialHairColor: String,
    facialHairType: String,
    graphicType: String,
    hairColor: String,
    mouthType: String,
    skinColor: String,
    topType: String,
    random: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      queryString: "",
    };
  },
  computed: {
    ...mapState(["userProfile"]),
    avatarURL() {
      return `https://avataaars.io${this.queryString}`;
    },
  },
  methods: {
    generateNewAvatar() {
      let queryString = Object.keys(AvataaarMetadata)
        .filter((prop) => (this.random ? true : this[prop]))
        .map((prop) => {
          if (this.random && prop != "avatarStyle") {
            let rand = Math.floor(
              Math.random() * AvataaarMetadata[prop].properties.length
            );
            return `${prop}=${AvataaarMetadata[prop].properties[rand]}`;
          } else {
            return `${prop}=${this[prop]}`;
          }
        })
        .join("&");
      if (queryString.length) {
        queryString = `?${queryString}`;
      }
      this.queryString = queryString;

      this.addAvatarToFB(queryString);
    },
    addAvatarToFB(queryString) {
      console.log(usersCollection);
      console.log(this.userProfile);
    },
  },
};
</script>
