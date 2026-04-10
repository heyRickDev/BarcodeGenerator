import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'fs'

function noJekyll() {
  return {
    name: 'nojekyll',
    closeBundle() {
      copyFileSync('.nojekyll', 'dist/.nojekyll')
    }
  }
}

export default defineConfig({
  plugins: [react(), noJekyll()],
  base: '/BarcodeGenerator/',
})
