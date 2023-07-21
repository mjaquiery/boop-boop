<template>
  <v-app>
    <v-app-bar :elevation="2" color="primary">
      <v-toolbar-title
        class="pointer"
        @click="() => {currentPage = pages.WELCOME}"
      >Potato Matching Game</v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="detailsOpen = !detailsOpen" title="More information">
        <v-icon>mdi-information-outline</v-icon>
      </v-btn>
      <v-btn icon @click="settingsOpen = !settingsOpen" title="Change settings">
        <v-icon v-if="!settingsOpen">mdi-cog-outline</v-icon>
        <v-icon v-else>mdi-cog</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main class="bg-secondary">
      <v-dialog
        transition="dialog-top-transition"
        width="auto"
        v-model="settingsOpen"
      >
        <SettingsPanel @changed="() => settings_changed = true" />
      </v-dialog>
      <v-dialog
        transition="dialog-top-transition"
        width="auto"
        v-model="detailsOpen"
      >
        <StudyDetails />
      </v-dialog>
      <v-responsive class="pa-2">
        <v-container>
          <v-row class="d-flex justify-center w-100">
            <v-col cols="12" md="8" lg="6" xl="4">
              <v-window
                direction="vertical"
                v-model="currentPage"
                class="w-100"
              >

                <v-window-item :value="pages.WELCOME">
                  <Welcome />
                </v-window-item>

                <v-window-item :value="pages.DIFFICULTY">
                  <Difficulty />
                </v-window-item>

                <v-window-item :value="pages.CONSENT">
                  <Consent />
                </v-window-item>

                <v-window-item :value="pages.GAME">
                  <Game />
                </v-window-item>

              </v-window>

            </v-col>
          </v-row>
        </v-container>
      </v-responsive>
      <v-snackbar
        color="success"
        variant="elevated"
        v-model="settings_updated"
        :close-on-content-click="true"
        location="top"
      >Settings saved</v-snackbar>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
import {pages, useDefaultStore} from "@/stores/default";
import SettingsPanel from "@/components/SettingsPanel.vue";
import Consent from "@/components/Consent.vue";
import Game from "@/components/Game.vue";
import {ref, watch} from "vue";
import Welcome from "@/components/Welcome.vue";
import Difficulty from "@/components/Difficulty.vue";
import StudyDetails from "@/components/StudyDetails.vue";

const {currentPage, detailsOpen, settingsOpen} = storeToRefs(useDefaultStore())

const settings_updated = ref<boolean>(false);
const settings_changed = ref<boolean>(false);

watch(settingsOpen, (value) => {
  if (!value) {
    settings_updated.value = true
    settings_changed.value = false
  }
})
</script>
<style scoped>
.v-window {
  max-width: 600px;
  margin: auto;
}
.v-timeline {
  justify-content: start;
}
.pointer {
  cursor: pointer;
}
</style>
