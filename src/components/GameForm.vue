<template>
  <div class="game-form">
    <v-btn @click="dialog = !dialog" color="primary"> Add new game</v-btn>

    <v-dialog v-model="dialog" persistent width="600px">
      <v-card >
        <v-card-title> Add new game </v-card-title>
        <v-card-text>
          <v-form v-model="valid" ref="form" lazy-validation>
            <v-text-field
              v-model="title"
              :rules="fieldRules"
              label="Game title"
              required
              outlined
            >
            </v-text-field>

            <v-text-field
              v-model="developer"
              :rules="fieldRules"
              label="Game developer"
              required
              outlined
            >
            </v-text-field>


             <v-text-field
              v-model="publisher"
              :rules="fieldRules"
              label="Game publisher"
              required
              outlined
            >
            </v-text-field>


            <v-textarea
              v-model="description"
              :rules="fieldRules"
              label="Game description"
              required
              outlined
            >
            </v-textarea>

            <v-file-input
                accept="image/*"
                label="File input"
                v-model="file"
                show-size
            >
            </v-file-input>


            <v-btn 
                elevation="2" 
                color="primary" 
                @click="storeGame"
                :loading="isLoading"
            >
              Store
            </v-btn>
          </v-form>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="blue darken-1"
                text
                @click="dialog = false"
            >
                Close
            </v-btn>
        </v-card-actions>


      </v-card>
    </v-dialog>
  </div>
</template>



<script>

import {gamesCollection, auth, storage} from '../firebase'

export default {

    name: 'GameForm',
    data(){
        return{
            isLoading: false,
            valid: false,
            dialog: false,
            title: '',
            developer: '',
            publisher: '',
            description: '',
            file: null,
            fieldRules: [
                v => !!v || 'this field is required',
            ]

        }
    },
    methods:{
        resetForm(){
            this.$refs.form.reset()
        },
        async storeGame(){
            try {
                this.isLoading = false
                this.dialog = false

                //upload file
                const fileRef = 'uploads/games/' + this.file.name
                const snapshot = await storage.ref(fileRef).put(this.file)
            
                let data = {
                    userId: auth.currentUser.uid,
                    title: this.title,
                    developer: this.developer,
                    publisher: this.publisher,
                    description: this.description,
                    image: fileRef
                }

                const doc = await gamesCollection.add(data)

                await this.resetForm()
                this.isLoading = false
                this.dialog = false
            } catch(e){
                console.log(e)
            }
        }
    }
    
}
</script>