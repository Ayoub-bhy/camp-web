/// <reference types="vitest/config" />
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        registration: "registration.html",
      },
    },
  },
  test: {
    globals: true,
    environment: "node",
  },
});
