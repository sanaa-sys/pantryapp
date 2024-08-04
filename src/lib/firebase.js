// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: "AIzaSyCIjrSeOVlA-A3UNQUuda8XltIBx3Nr65o",
    authDomain: "pantry-app-16450.firebaseapp.com",
    projectId: "pantry-app-16450",
    storageBucket: "pantry-app-16450.appspot.com",
    messagingSenderId: "95930718137",
    appId: "1:95930718137:web:9a3107a36fb609c6570868",
    measurementId: "G-QQD43ELT8Q"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Optionally, initialize Analytics if you need it
// const analytics = getAnalytics(app);

export { db, app, firebaseConfig };
