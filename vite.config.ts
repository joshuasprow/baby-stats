import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";

const dir = (...parts: string[]) => resolve(__dirname, ...parts);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      $components: dir("src", "components"),
      $lib: dir("src", "lib"),
      $models: dir("src", "models"),
      $stores: dir("src", "stores"),
    },
  },
});
