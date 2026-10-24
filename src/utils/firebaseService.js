import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDzcuQJMFqF6hwK5BVSMF7o31Ory-BlwC4",
  authDomain: "pamce-44272.firebaseapp.com",
  projectId: "pamce-44272",
  storageBucket: "pamce-44272.firebasestorage.app",
  messagingSenderId: "165890326918",
  appId: "1:165890326918:web:8412bb8e03c349a04e6c07",
  measurementId: "G-2ZJ51838BY",
};

initializeApp(firebaseConfig);

export const auth = getAuth();


