import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
    hmr: {
      overlay: false
    },
    fs: {
      allow: ['..']
    }
  },
  optimizeDeps: {
    exclude: [
      '@ffmpeg/ffmpeg', 
      '@ffmpeg/util',
      'wavesurfer.js',
      'wavesurfer.js/dist/plugins/regions.js'
    ]
  },
  define: {
    global: 'globalThis',
  },
  assetsInclude: ['**/*.wasm']
})
