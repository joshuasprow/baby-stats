import { getAuth } from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { initializeApp, type FirebaseOptions } from "firebase/app";
import { z } from "zod";

const Options = z.object({
  apiKey: z.string().min(1),
  authDomain: z.string().min(1),
  projectId: z.string().min(1),
  storageBucket: z.string().min(1),
  messagingSenderId: z.string().min(1),
  appId: z.string().min(1),
  measurementId: z.string().min(1),
});

const projectId = import.meta.env.VITE_PROJECT_ID;

let options: FirebaseOptions = {};

try {
  options = Options.parse({
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: `${projectId}.firebaseapp.com`,
    projectId: `${projectId}`,
    storageBucket: `${projectId}.appspot.com`,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
    measurementId: import.meta.env.VITE_MEASUREMENT_ID,
  });
} catch (error) {
  console.error(error);
}

const app = initializeApp(options);

export const auth = getAuth(app);
export const db = getFirestore(app);
