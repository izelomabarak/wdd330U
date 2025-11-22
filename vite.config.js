import { resolve } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

// Equivalent of __dirname in ES modules
const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  root: "src/",

  server: {
    open: true // optional, helps development
  },

  build: {
    outDir: "../dist",
    emptyOutDir: true, // Vite now warns if this is missing

    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        cart: resolve(__dirname, "src/cart/index.html"),
        checkout: resolve(__dirname, "src/checkout/index.html"),
        product: resolve(__dirname, "src/product_pages/index.html"),
        productlisting: resolve(
          __dirname,
          "src/product_listing/index.html"
        )
      }
    }
  }
});