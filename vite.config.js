import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["react-pdf"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "pdfjs-worker": ["pdfjs-dist/build/pdf.worker.entry"],
        },
      },
    },
  },
})
