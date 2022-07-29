// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkZSPRpychui2AgryzWJ5elbQ3vjK7zjA",
  authDomain: "baby-stats-10331.firebaseapp.com",
  projectId: "baby-stats-10331",
  storageBucket: "baby-stats-10331.appspot.com",
  messagingSenderId: "1004071948326",
  appId: "1:1004071948326:web:b5ea182e6f5e2a7353d6e7",
  measurementId: "G-26JQ1TZBKW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default app;
