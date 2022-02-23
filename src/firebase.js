import firebase from "firebase/app";
import "firebase/auth";

export const auth = firebase.initializeApp({
  apiKey: "AIzaSyB7BV5YaQ5_c6AUes2UeXH6HP_evL-a-zA",
  authDomain: "chat-app-602b5.firebaseapp.com",
  projectId: "chat-app-602b5",
  storageBucket: "chat-app-602b5.appspot.com",
  messagingSenderId: "667914008339",
  appId: "1:667914008339:web:1fc9036dda0be9b020cce6",
  measurementId: "G-H02XM619QQ"
}).auth();