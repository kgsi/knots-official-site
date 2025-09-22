// @ts-check
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  alias: {
    '@': './src',
    '@components': './src/components',
    '@assets': './src/assets',
  }
})
