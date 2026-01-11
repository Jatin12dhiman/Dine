// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCQdvd24zqY1WZ2zRF06K8OK01jucZA-cM",
  authDomain: "starter-cb5cb.firebaseapp.com",
  databaseURL: "https://starter-cb5cb-default-rtdb.firebaseio.com",
  projectId: "starter-cb5cb",
  storageBucket: "starter-cb5cb.firebasestorage.app",
  messagingSenderId: "332518932291",
  appId: "1:332518932291:web:65155dcd312a6040a6b9f6",
  measurementId: "G-21CN3DRQ82"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);