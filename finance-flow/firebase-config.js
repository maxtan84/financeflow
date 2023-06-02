// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebase from 'firebase/app';
import 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDUd3Ts0iHUbK_RJUc4cOnhsOYXccniE8Y",
  authDomain: "financeflow-a293d.firebaseapp.com",
  projectId: "financeflow-a293d",
  storageBucket: "financeflow-a293d.appspot.com",
  messagingSenderId: "444662007211",
  appId: "1:444662007211:web:5e16ebbc7b12044467beee",
  measurementId: "G-4V2523DD7E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


