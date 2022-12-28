import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";
import { defineConfig } from "vite";
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";

const dir = (...parts: string[]) => resolve(__dirname, ...parts);

const pwaOptions: Partial<VitePWAOptions> = {
  registerType: "prompt",
  devOptions: {
    enabled: true,
    navigateFallback: "index.html",
    type: "module",
  },
  srcDir: ".",
  filename: "prompt-sw.ts",
  includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
  strategies: "injectManifest",
  manifest: {
    name: "Baby Stats",
    short_name: "BabyStats",
    description: "For keeping track of baby.",
    theme_color: "#ffffff",
    icons: [
      {
        src: "pwa-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: dir("dist"),
    sourcemap: true,
  },
  define: {
    VITE_API_KEY: process.env.VITE_API_KEY,
    VITE_PROJECT_ID: process.env.VITE_PROJECT_ID,
    VITE_MESSAGING_SENDER_ID: process.env.VITE_MESSAGING_SENDER_ID,
    VITE_APP_ID: process.env.VITE_APP_ID,
    VITE_MEASUREMENT_ID: process.env.VITE_MEASUREMENT_ID,
  },
  plugins: [svelte(), VitePWA(pwaOptions)],
});
