// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnyPM5bGpVc0R2xSj2Zm0VG7lHTfaMq-c",
  authDomain: "eventify-83f7e.firebaseapp.com",
  projectId: "eventify-83f7e",
  storageBucket: "eventify-83f7e.firebasestorage.app",
  messagingSenderId: "525600674990",
  appId: "1:525600674990:web:be33d480141895d46e493f",
  measurementId: "G-XKQSNVZT6N"
};

console.log("Initializing Firebase...");

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("Firebase app initialized successfully");

// Initialize Firebase Authentication with React Native persistence
let auth;
try {
  // Try to initialize auth with AsyncStorage persistence
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
  console.log("Firebase auth initialized successfully with AsyncStorage persistence");
} catch (error) {
  // If auth is already initialized, get the existing instance
  if (error.code === 'auth/already-initialized') {
    auth = getAuth(app);
    console.log("Using existing Firebase auth instance");
  } else {
    console.error("Error initializing Firebase auth:", error);
    // Fallback to getAuth
    auth = getAuth(app);
    console.log("Using fallback getAuth");
  }
}

// Initialize Firestore
const db = getFirestore(app);
console.log("Firestore initialized successfully");

export { auth, db };
export default app;