import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics'; // 👈 Add this

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
const auth = getAuth(app);
const db = getFirestore(app);

// 👇 Enable analytics only if it's supported (browser environment)
let analytics;
if (typeof window !== 'undefined') {
  isSupported().then((yes) => {
    if (yes) analytics = getAnalytics(app);
  });
}

export { app, auth, db, analytics };