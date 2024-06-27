import { defineStore } from 'pinia'

interface IAlert {
  id: string
  type: 'info' | 'warning' | 'error'
  title?: string
  text: string
}
const isServer = typeof window === 'undefined'
const baseUrl = 'https://api.metaspan.io'

export const useStore = defineStore('store', {
  state: () => ({
    // appVersion: process.env.PACKAGE_VERSION || '0',
    initial: true,
    loading: false,
    // baseUrl: process.env.NODE_ENV === 'production'
    //   ? 'https://api.metaspan.io'
    //   : `//${window.location.hostname}:${window.location.port}`,
    baseUrl,
    dark: true,
    showSettingsDialog: false,
    showNavDrawer: false,
    alerts: [] as IAlert[],
    chainId: 'encointer'
  }),
  actions: {
    async init () {
      // await commit('SET_LOADING', true)
      this.loading = true
      this.setChainId(this.chainId)
      this.initial = false
      this.loading = false
    },
    setLoading (loading: boolean) {
      this.loading = loading
    },
    setDark (dark: boolean) {
      this.dark = dark
    },
    // setShowSettingsDialog (value: boolean) {
    //   this.showSettingsDialog = value
    // },
    addAlert (alert: IAlert) {
      this.alerts.push(alert)
    },
    clearAlert (alert: IAlert) {
      this.alerts = this.alerts.filter(f => f.id !== alert.id)
    },
    setShowNavDrawer (value: boolean) {
      this.showNavDrawer = value
    },
    toggleNavDrawer () {
      this.showNavDrawer = !this.showNavDrawer
    },
    resetCache () {
      console.debug('stores/index.ts: actions.resetCache()')
      // dispatch('candidate/resetCache', {}, { root: true })
      // dispatch('pool/resetCache', {}, { root: true })
    },
    async setChainId (chainId: string) {
      console.debug('stores/index.js: actions.setChain()', chainId)
      this.chainId = chainId
    },
  }
})
