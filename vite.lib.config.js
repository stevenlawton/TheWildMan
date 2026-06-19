import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Library build: bundles the data + visualisation components into an ESM
// artifact for consumers (e.g. stevenlawton.com). React is a PEER (not
// bundled) - the host provides it. The viz deps (topojson-client,
// world-atlas, lucide-react) ARE bundled so consumers get a self-contained
// import. Separate from the app/demo build (vite.config.js).
export default defineConfig({
  plugins: [react()],
  // Don't copy public/ into the lib output - figure images are shipped
  // explicitly via package.json "files" (public/images) instead, keeping
  // dist-lib to just the bundle.
  publicDir: false,
  build: {
    outDir: "dist-lib",
    emptyOutDir: true,
    lib: {
      entry: "src/lib.js",
      formats: ["es"],
      fileName: () => "wildman.js",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "react-dom/client"],
    },
  },
});
