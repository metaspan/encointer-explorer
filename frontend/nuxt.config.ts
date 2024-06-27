// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
// dotenv
import dotenv from 'dotenv'
dotenv.config()

console.debug('nuxt.config.ts: process.env.GRAPHQL_URL', process.env.GRAPHQL_URL)

export default defineNuxtConfig({
  build: {
    transpile: ['vuetify'],
  },
  plugins: [
    '@/plugins/vuetify',
  ],
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    // ...
    '@pinia/nuxt',
    '@nuxtjs/apollo',
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  apollo: {
    autoImports: true,
    authType: 'Bearer',
    authHeader: 'Authorization',
    tokenStorage: 'cookie',
    proxyCookies: true,
    clients: {
      default: {
        httpEndpoint: process.env.GRAPHQL_URL || 'http://localhost:4350/graphql',
        connectToDevTools: true,
        inMemoryCacheOptions: {
          typePolicies: {
            Block: {
              keyFields: ['id']
            },
            Extrinsic: {
              keyFields: ['id']
            },
            Event: {
              keyFields: ['id']
            },
            Account: {
              keyFields: ['id']
            },
          }
        },
      },
    },
  },
  $production: {
    title: 'Encointer Explorer',
    devtools: { enabled: false },
  },
  $development: {
    title: 'Encointer Explorer DEV',
    devtools: { enabled: true },
    devServer: {
      port: 8080
    }
  }
})