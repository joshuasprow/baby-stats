import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";
import tsconfig from "./tsconfig.json";

const dir = (...parts: string[]) => resolve(__dirname, ...parts);

const alias = Object.entries(tsconfig.compilerOptions.paths).reduce(
  (a, [k, v]) => {
    const key = k.replace("/*", "");
    const value = dir(v[0].replace("/*", ""));

    a[key] = value;

    return a;
  },
  {} as { [key: string]: string },
);

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
  resolve: {
    alias,
    // alias: {
    //   $components: dir("client", "components"),
    //   $firebase: dir("client", "firebase"),
    //   $lib: dir("client", "lib"),
    //   $models: dir("client", "models"),
    //   $stores: dir("client", "stores"),
    // },
  },
});
