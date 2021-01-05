import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import {firebaseConfig} from '../.firebase.config.js'

  firebase.initializeApp(firebaseConfig);

  //utils

  const db = firebase.firestore()
  const auth = firebase.auth();
  const storage = firebase.storage();

  
  //collection ref

  const usersCollection = db.collection('users')
  const workoutCollection = db.collection('workout')

  export {
      db,
      auth,
      storage,
      usersCollection,
      workoutCollection
  }