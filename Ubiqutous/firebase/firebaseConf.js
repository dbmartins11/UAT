// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBgSZE5T7DAnicxSJ4De4MmItG4rCkcMfU",
  authDomain: "ubiqutous-dcb47.firebaseapp.com",
  projectId: "ubiqutous-dcb47",
  storageBucket: "ubiqutous-dcb47.firebasestorage.app",
  messagingSenderId: "27101635135",
  appId: "1:27101635135:web:4179d75aba6271b5f80e8a",
  measurementId: "G-E7Q748C352"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);