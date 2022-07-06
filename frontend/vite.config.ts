import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import shimReactPdf from "vite-plugin-shim-react-pdf";
import md from "vite-plugin-react-md";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), shimReactPdf(), md()],
  server: {
    host: true,
  },
});
