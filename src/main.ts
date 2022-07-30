import "./app.css";
import App from "./App.svelte";

const target = document.getElementById("app");

if (target === null) {
  throw new Error("No app element found");
}

const app = new App({ target });

export default app;
