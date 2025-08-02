// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import autoprefixer from "autoprefixer";

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
  output: "server",
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
      // Optimize assets - increase inline limit for critical CSS
      assetsInlineLimit: 8192,
      // Optimize chunk size
      chunkSizeWarningLimit: 1000,
      // Rollup options for better tree shaking
      rollupOptions: {
        output: {
          manualChunks: {
            // Separate font chunks
            fonts: ['@fontsource/inter'],
            // Separate performance utilities
            performance: ['../utils/performance']
          }
        }
      },
      // Optimize target for modern browsers
      target: 'esnext',
      // Enable source maps only in development
      sourcemap: false
    },
    // Optimize dependencies
    optimizeDeps: {
      // Pre-bundle critical dependencies
      force: true
    },
    // CSS optimization
    css: {
      // Enable CSS code splitting
      devSourcemap: false,
      // Optimize CSS output
      postcss: {
        plugins: [
          // Add autoprefixer for better browser compatibility
          autoprefixer
        ]
      }
    }
  }
});
