import { defineConfig } from "vite";

export default defineConfig({
  root: "frontend",
  server: {
    host: true,
  port: 5173,
  open: false,
  strictPort: true,
  allowedHosts: true,
  cors: true,
  headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
});
