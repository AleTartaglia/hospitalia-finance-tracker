import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/hospitalia-finance-tracker/", // Ruta para GitHub Pages
});
