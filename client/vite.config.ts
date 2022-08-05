import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";

const dir = (...parts: string[]) => resolve(__dirname, ...parts);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    outDir: dir("../dist"),
  },
  resolve: {
    alias: {
      $components: dir("components"),
      $lib: dir("lib"),
      $stores: dir("stores"),
    },
  },
});
