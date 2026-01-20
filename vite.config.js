import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'Wilan Week Planner',
        short_name: 'WilanPlanner',
        description: 'Personal weekly todo planner with timers',
        theme_color: '#e91e63',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
  {
    src: 'logo192x192.png',
    sizes: '192x192',
    type: 'image/png',
  },
  {
    src: 'logo512x512.png',
    sizes: '512x512',
    type: 'image/png',
  },
]

      }
    })
  ]
})
