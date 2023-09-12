<script setup lang="ts">
import {useDefaultStore, pages} from "@/stores/default";
import {storeToRefs} from "pinia";
import {useSettingsStore} from "@/stores/settings";
import explore_img from '@/assets/explore.png';
import challenge_img from '@/assets/challenge.png';

const {currentPage, modeSelected, settingsOpen} = storeToRefs(useDefaultStore())
const {load_defaults} = useSettingsStore()

const process_click = (value: "child"|"free_play") => {
  if (!value) return

  if (value === "free_play") {
    load_defaults("free_play")
    currentPage.value = pages.CONSENT
    return
  }

  currentPage.value = pages.DIFFICULTY
}
</script>

<template>
  <v-timeline

    side="end"
    class="w-100"
  >
    <v-timeline-item
      size="x-large"
      :icon-color="modeSelected? 'secondary' : 'primary'"
      icon="mdi-cog-outline"
      :dot-color="modeSelected? 'primary' : 'secondary'"
    >
      <v-card class="pa-4" variant="text">
        <v-card-title>Game mode</v-card-title>
        <p class="text-body-1 mt-4">
          Click the picture for the <strong>game mode</strong> you want to play.
        </p>
        <v-item-group selected-class="bg-primary" class="mb-4" v-model="modeSelected">
          <v-container>
            <v-row>
              <v-col
                cols="6"
              >
                <v-item value="free_play" v-slot="{ selectedClass, select }">
                  <v-card
                    :class="['mx-auto', 'py-2', selectedClass]"
                    color="primary"
                    variant="tonal"
                    height="200"
                    @click="() => {select!(true); process_click('free_play')}"
                  >
                    <v-img
                      :src="explore_img"
                      height="80%"
                    ></v-img>
                    <v-card-title class="text-center text-black">
                      Explore
                    </v-card-title>
                  </v-card>
                </v-item>
              </v-col>
              <v-col
                cols="6"
              >
                <v-item value="child" v-slot="{ selectedClass, select }">
                  <v-card
                    :class="['mx-auto', 'py-2', selectedClass]"
                    color="primary"
                    height="200"
                    variant="tonal"
                    @click="() => {select!(true); process_click('child')}"
                  >
                    <v-img
                      :src="challenge_img"
                      height="80%"
                    ></v-img>
                    <v-card-title class="text-center text-black">
                      Challenge
                    </v-card-title>
                  </v-card>
                </v-item>
              </v-col>
            </v-row>
          </v-container>
        </v-item-group>
        <v-card-actions>
          <v-btn
            @click="settingsOpen = true"
          >
            Customise settings
          </v-btn>
          <v-spacer />
          <v-btn
            @click="currentPage--"
            variant="tonal"
          >
            Go back
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-timeline-item>
  </v-timeline>
</template>

<style scoped>
</style>
