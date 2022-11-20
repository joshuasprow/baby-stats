import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const dir = (...parts: string[]) => resolve(__dirname, ...parts);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: { enabled: true },
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
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
        ],
      },
    }),
  ],
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
