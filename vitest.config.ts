import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./__tests__/setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      "next-intl": path.resolve(__dirname, "node_modules/next-intl"),
      "next-intl/routing": path.resolve(__dirname, "node_modules/next-intl/dist/esm/routing.js"),
      "next-intl/navigation": path.resolve(__dirname, "node_modules/next-intl/dist/esm/navigation.react-client.js"),
    },
  },
});
