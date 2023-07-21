import { defineStore } from 'pinia'
import {ref} from "vue";

export const pages = {
  WELCOME: 0,
  DIFFICULTY: 1,
  CONSENT: 2,
  GAME: 3
}

export const useDefaultStore = defineStore('defaults', () => {
  const currentPage = ref<number>(0)
  const detailsOpen = ref<boolean>(false)
  const settingsOpen = ref<boolean>(false)
  const difficultySelected = ref<string>()
  const consentSelected = ref<boolean>()

  return {
    currentPage: currentPage,
    difficultySelected,
    consentSelected,
    detailsOpen,
    settingsOpen,
  }
})
