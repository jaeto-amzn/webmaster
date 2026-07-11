import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" makes built asset URLs relative, required for a GitHub Pages
// project site served from https://<user>.github.io/webmaster/
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "dist",
    sourcemap: false,
    chunkSizeWarningLimit: 400,
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    coverage: { reporter: ["text", "lcov"] },
  },
});
