import { defineStore } from 'pinia'

export const useCounter = defineStore({
  id: 'counter',

  state: () => ({
    count: 2
  }),

  getters: {},

  actions: {
    increment() {
      this.count && this.count++
    }
  }

  //persist: true,
})
