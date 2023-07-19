<template>
  <v-app>
    <v-app-bar :elevation="2" color="primary">
      <v-toolbar-title>Boop-Boop Game</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleSettingsOpen" >
        <v-icon v-if="!settingsOpen">mdi-cog-outline</v-icon>
        <v-icon v-else>mdi-cog</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-information-outline</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container class="fill-height">
        <v-sheet v-if="settingsOpen" class="align-center text-center w-100 fill-height position-relative">
          <SettingsPanel />
        </v-sheet>
        <v-responsive v-else class="align-center text-center fill-height">
          <v-carousel
            hide-delimiters
            :show-arrows="send_data_consent !== undefined"
            class="fill-height"
            :continuous="false"
          >

            <v-carousel-item>
              <Game />
            </v-carousel-item>

            <v-carousel-item>
              <Consent />
            </v-carousel-item>

          </v-carousel>
        </v-responsive>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useSettingsStore} from "@/stores/settings";
import {useDefaultStore} from "@/stores/default";
import SettingsPanel from "@/components/SettingsPanel.vue";
import Consent from "@/components/Consent.vue";
import Game from "@/components/Game.vue";

const {settingsOpen} = storeToRefs(useDefaultStore())
const {toggleSettingsOpen} = useDefaultStore()
const {send_data_consent} = storeToRefs(useSettingsStore())
</script>
