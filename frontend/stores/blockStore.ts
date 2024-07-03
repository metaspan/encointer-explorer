import { defineStore } from 'pinia'

interface IState {
  initial: boolean
  chainId: string
  // Search
  startDate: Date
  endDate: Date
  page: number
  limit: number
  offset: number
}

const initialState = {
  initial: true,
  chainId: 'encointer',
  // Search
  // start of today
  startDate: new Date(new Date().setHours(0, 0, 0, 0)),
  // end of today
  endDate: new Date(new Date().setHours(23, 59, 59, 999)),
  page: 1,
  limit: 25,
  offset: 0
} as IState

export const useBlockStore = defineStore('block', {
  state: (() => initialState),
  actions: {}
})
