import { initializeFirebase } from "./firebase";
import App from "./App.svelte";

const target = document.getElementById("app");

if (target === null) {
  throw new Error("No app element found");
}

initializeFirebase();

const app = new App({ target });

export default app;
