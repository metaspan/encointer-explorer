import { defineStore } from 'pinia'
import { type IAccount } from '../../global/types'

interface IState {
  initial: boolean
  chainId: string
  // Search
  startDate: Date
  endDate: Date
  limit: number
  offset: number
  page: number
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

export const useAccountStore = defineStore('account', {
  state: (() => initialState),
  actions: {}
})
