// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://espai.ai",
  integrations: [mdx(), sitemap()],
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
    imageService: "compile",
    mode: "advanced"
  }),
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp"
    }
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es", "ca", "de"],
    routing: {
      prefixDefaultLocale: false
    }
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['astro/runtime/client/hmr.js']
          }
        }
      }
    }
  }
});
