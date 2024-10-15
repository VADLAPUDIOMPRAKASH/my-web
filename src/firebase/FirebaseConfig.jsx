// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDujr-7FIL5e7Cad1VWr90CdqYfpKuE_zs",
  authDomain: "navedhana-web.firebaseapp.com",
  projectId: "navedhana-web",
  storageBucket: "navedhana-web.appspot.com",
  messagingSenderId: "372018135359",
  appId: "1:372018135359:web:bc760cf1e093625d14538a",
  measurementId: "G-9M8XVVN81R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const fireDB = getFirestore(app);
const auth = getAuth(app)
export {fireDB,auth } ;