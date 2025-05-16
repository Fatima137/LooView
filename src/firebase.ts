// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // Import the Auth service
// import { getAuth } from 'firebase/auth'; // Added import for Authentication
import { getFirestore } from 'firebase/firestore'; // Zorg ervoor dat deze import er is!
import { Database } from 'lucide-react';

// Jouw web app's Firebase configuration (gevonden in de console)
const firebaseConfig = {
  apiKey: "AIzaSyBUR01CYaHjDCSDozl71wDQief12hRc5V0",
  authDomain: "looview-8225d.firebaseapp.com",
  projectId: "looview-8225d",
  storageBucket: "looview-8225d.firebasestorage.app",
  messagingSenderId: "115538413650",
  appId: "1:115538413650:web:935a290d51b0ae84b0778b",
  measurementId: "G-S2YQJCJG93",
  databaseURL: "https://looview-8225d-default-rtdb.europe-west1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app); // Initialize Auth

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app); // <--- Zorg ervoor dat deze lijn aanwezig is en db wordt geëxporteerd

export { app, auth, db }; // Exporteer app, auth, and db
