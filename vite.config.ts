import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      $components: resolve(__dirname, "src/components"),
      $lib: resolve(__dirname, "src/lib"),
      $stores: resolve(__dirname, "src/stores"),
    },
  },
});
