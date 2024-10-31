// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {getStorage} from "firebase/storage"


const firebaseConfig = {
  apiKey: "AIzaSyDcxXQM5pZZ2O299_glgkcxKdUKxLqCfy0",
  authDomain: "navedhana-c4275.firebaseapp.com",
  projectId: "navedhana-c4275",
  storageBucket: "navedhana-c4275.appspot.com",
  messagingSenderId: "117192151571",
  appId: "1:117192151571:web:817fb8452d2ce41e5065e6",
  measurementId: "G-KX2K13R4EP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const fireDB = getFirestore(app);
const auth = getAuth(app)
const imgDB = getStorage(app)
export {fireDB,auth, imgDB } ;