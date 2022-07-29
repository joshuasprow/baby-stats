// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBkZSPRpychui2AgryzWJ5elbQ3vjK7zjA",
  authDomain: "baby-stats-10331.firebaseapp.com",
  projectId: "baby-stats-10331",
  storageBucket: "baby-stats-10331.appspot.com",
  messagingSenderId: "1004071948326",
  appId: "1:1004071948326:web:b5ea182e6f5e2a7353d6e7",
  measurementId: "G-26JQ1TZBKW",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
