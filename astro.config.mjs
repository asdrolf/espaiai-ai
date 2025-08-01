// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://espai.ai",
  integrations: [
    mdx(), 
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: {
          en: "en",
          es: "es", 
          ca: "ca",
          de: "de"
        }
      },
      // Ensure consistent URL format with trailing slashes
      serialize(item) {
        // Add trailing slash if not present and not a file
        if (!item.url.endsWith('/') && !item.url.includes('.')) {
          item.url += '/';
        }
        return item;
      }
    })
  ],
  adapter: cloudflare({
    imageService: "compile"
  }),
  output: "static",
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
  // Ensure trailing slashes for consistency
  trailingSlash: "always",
  // Performance optimizations
  vite: {
    build: {
      // Optimize CSS
      cssCodeSplit: true,
      // Enable minification
      minify: 'esbuild',
      // Optimize assets
      assetsInlineLimit: 4096,
    },
    // Optimize dependencies
    optimizeDeps: {
      include: ['klaro']
    }
  }
});
