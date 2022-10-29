import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";
import { defineConfig } from "vite";

const dir = (...parts: string[]) => resolve(__dirname, ...parts);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    outDir: dir("dist"),
  },
  define: {
    VITE_API_KEY: process.env.VITE_API_KEY,
    VITE_PROJECT_ID: process.env.VITE_PROJECT_ID,
    VITE_MESSAGING_SENDER_ID: process.env.VITE_MESSAGING_SENDER_ID,
    VITE_APP_ID: process.env.VITE_APP_ID,
    VITE_MEASUREMENT_ID: process.env.VITE_MEASUREMENT_ID,
  },
});
