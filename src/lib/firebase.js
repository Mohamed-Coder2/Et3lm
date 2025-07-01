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
  apiKey: "AIzaSyB_cv95e1VOPXb4Wx9Q5GD5Q1JAF_WZW8M",
  authDomain: "grad-lms.firebaseapp.com",
  projectId: "grad-lms",
  storageBucket: "grad-lms.firebasestorage.app",
  messagingSenderId: "326148157182",
  appId: "1:326148157182:web:36a7b8754f7d06ffd73faf",
  measurementId: "G-P32Y54W7VE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, app, auth };