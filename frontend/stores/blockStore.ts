import { defineStore } from 'pinia'

import { type IBlock } from '../../global/types'
import { useStore } from './index'

interface IPagination {
  page: number
  itemsPerPage: number
}

interface IOptions {
  page: number
  itemsPerPage: number
  sortBy: string
  sortDesc: boolean
}

interface IFilter {
  valid: boolean
  active: boolean
}

interface IState {
  initial: boolean
  chainId: string
  // Search
  startDate: Date
  endDate: Date
  limit: number
  offset: number
}

const initialState = {
  initial: true,
  chainId: 'encointer',
  // Search
  startDate: new Date(),
  endDate: new Date(),
  limit: 25,
  offset: 0
} as IState

export const useBlockStore = defineStore('block', {
  state: (() => initialState),
  getters: {
    list (): IBlock[] {
      console.debug('stores/blockStore.ts: getters.list()', useStore().chainId)
      return this.chains[useStore().chainId].list
    },
    block (): IBlock {
      console.debug('stores/blockStore.ts: getters.pool()', useStore().chainId)
      return this.chains[useStore().chainId].pool
    }
  },
  actions: {
    async init () {
      this.initial = false
    },
    async setChainId (chainId: string) {
      this.chainId = chainId
    },
    async loading (loading: boolean) {
      this.chains[this.chainId].loading = loading
    },
    async addPool (pool: IBlock) {
      // console.debug('stores/blockStore.ts: addPool()', pool)
      this.list.push(pool)
    },
    async setList (list: IBlock[]) {
      // console.debug('blockStore.ts: action.setList()', list)
      this.chains[this.chainId].list = list
    },
    async setBlock (blockId: string) {
      console.debug('stores/blockStore.ts: setBlock()', blockId)
      const v = this.list.find((pool: IBlock) => Number(pool.id) === Number(blockId))
    },
  }
})
