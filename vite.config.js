// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 1. 引入 Tailwind CSS 的 Vite 外掛

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 2. 將外掛加入到 plugins 陣列中
  ],
})