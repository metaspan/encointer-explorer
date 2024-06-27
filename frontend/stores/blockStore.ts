import { defineStore } from 'pinia'

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
  page: 1,
  limit: 25,
  offset: 0
} as IState

export const useBlockStore = defineStore('block', {
  state: (() => initialState),
  actions: {}
})
