import { defineStore } from 'pinia'
import {ref} from "vue";

export const useDefaultStore = defineStore('defaults', () => {
  const settingsOpen = ref<boolean>(false)
  function toggleSettingsOpen() {
    settingsOpen.value = !settingsOpen.value
  }
  return { settingsOpen, toggleSettingsOpen }
})
