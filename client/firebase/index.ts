import { FirebaseOptions, initializeApp } from "@baby-stats/firebase";

const projectId = import.meta.env.VITE_PROJECT_ID;

const options = FirebaseOptions.parse({
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: `${projectId}.firebaseapp.com`,
  projectId: `${projectId}`,
  storageBucket: `${projectId}.appspot.com`,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
});

export const { auth, db } = initializeApp(options);
