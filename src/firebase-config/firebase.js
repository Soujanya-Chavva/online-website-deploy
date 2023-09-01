
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore, doc, setDoc, collection, addDoc, getDocs, getDoc, updateDoc } from "firebase/firestore"






const firebaseConfig = {
    apiKey: "AIzaSyAbemLutMkIJaFxlKag0Xz1-wprKlJ_lJQ",
    authDomain: "shop-spectrum-website.firebaseapp.com",
    projectId: "shop-spectrum-website",
    storageBucket: "shop-spectrum-website.appspot.com",
    messagingSenderId: "330067555306",
    appId: "1:330067555306:web:b0fd20e91f8ea114337893"
  };


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)

export {  doc, setDoc, collection, addDoc, getDocs, getDoc, updateDoc };