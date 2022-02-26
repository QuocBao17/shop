import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore" //upload len firestore
import { getStorage } from "firebase/storage" // up load image to storage

const firebaseConfig = {
  apiKey: "AIzaSyDAkU3Gsn__K-KMOLg8bSnMyF5DQn_lmRI",
  authDomain: "api-shop-test.firebaseapp.com",
  projectId: "api-shop-test",
  storageBucket: "api-shop-test.appspot.com",
  messagingSenderId: "170777305768",
  appId: "1:170777305768:web:626803d1483cf07720d89d",
  measurementId: "G-23QEDSWGQ8"
};

export const app =initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const database = getFirestore();

