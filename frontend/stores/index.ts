import { defineStore } from 'pinia'

interface IAlert {
  id: string
  type: 'info' | 'warning' | 'error'
  title?: string
  text: string
}
const isServer = typeof window === 'undefined'

export const useStore = defineStore('store', {
  state: () => ({
    initial: true,
    loading: false,
    dark: true,
    chainId: 'encointer'
  }),
  actions: {
    async init () {
      this.loading = false
    }
  }
})
