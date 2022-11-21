import App from "./App.svelte";
import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  onNeedRefresh() {
    // show a prompt to user
    console.log("sw: need refresh");
  },
  onOfflineReady() {
    console.log("sf: offline ready");
  },
  onRegisterError(error) {
    console.log("sw: register error: ", error);
  },
  onRegisteredSW(swScriptUrl, registration) {
    console.log("sw: registered: ", swScriptUrl, registration);
  },
});

const target = document.getElementById("app");

if (target === null) {
  throw new Error("No app element found");
}

const app = new App({ target });

export default app;
