import { initialize, type FirebaseOptions } from "baby-stats-firebase";
import { z, ZodObject, type AnyZodObject, type SomeZodObject } from "zod";

const Options = z.object({
  apiKey: z.string().min(1),
  authDomain: z.string().min(1),
  projectId: z.string().min(1),
  storageBucket: z.string().min(1),
  messagingSenderId: z.string().min(1),
  appId: z.string().min(1),
  measurementId: z.string().min(1),
});

export const initializeFirebase = () => {
  try {
    const projectId = import.meta.env.VITE_PROJECT_ID;

    const options = Options.parse({
      apiKey: import.meta.env.VITE_API_KEY,
      authDomain: `${projectId}.firebaseapp.com`,
      projectId: `${projectId}`,
      storageBucket: `${projectId}.appspot.com`,
      messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_APP_ID,
      measurementId: import.meta.env.VITE_MEASUREMENT_ID,
    });

    initialize(options);
  } catch (error) {
    console.error(error);
  }
};
