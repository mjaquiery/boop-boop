import { defineStore } from 'pinia'
import {ref} from "vue";

export const pages = {
  WELCOME: 0,
  MODE: 1,
  DIFFICULTY: 2,
  CONSENT: 3,
  GAME: 4
}

export const useDefaultStore = defineStore('defaults', () => {
  const currentPage = ref<number>(0)
  const detailsOpen = ref<boolean>(false)
  const settingsOpen = ref<boolean>(false)
  const modeSelected = ref<string>()
  const difficultySelected = ref<string>()
  const consentSelected = ref<boolean>()

  return {
    currentPage: currentPage,
    difficultySelected,
    consentSelected,
    modeSelected,
    detailsOpen,
    settingsOpen,
  }
})
