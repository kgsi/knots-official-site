// @ts-check
import partytown from '@astrojs/partytown'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  vite: {
    resolve: {
      alias: {
        '@': './src',
        '@components': './src/components',
        '@assets': './src/assets',
      },
    },
  },
  integrations: [
    partytown({
      config: {
        forward: ['dataLayer.push', 'gtag'],
      },
    }),
  ],
})
