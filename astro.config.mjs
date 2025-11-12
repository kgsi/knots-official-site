// @ts-check
import partytown from '@astrojs/partytown'
import cloudflare from '@astrojs/cloudflare'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  image: {
    service: { entrypoint: 'astro/services/noop' },
  },
  integrations: [
    partytown({
      config: {
        forward: ['dataLayer.push', 'gtag'],
      },
    }),
  ],
})
