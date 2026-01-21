import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',

      // 👇 THIS is the key part
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,svg,webp}'],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },

      manifest: {
        name: "Wilan’s Week Planner",
        short_name: "Wilan",
        start_url: "/",
        display: "standalone",
        theme_color: "#F73486",
        background_color: "#0f0f1a",
        icons: [
          { src: "/logo32x32.png", sizes: "32x32", type: "image/png" },
          { src: "/logo192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/logo512x512.png", sizes: "512x512", type: "image/png" }
        ]
      }
    })
  ]
})
