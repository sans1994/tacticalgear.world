import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      vue(),
      legacy()
  ],
  css: {
    postcss: {
      plugins: [
        autoprefixer()
      ]
    }
  }
})
