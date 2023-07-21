<script setup lang="ts">
import {useDefaultStore} from "@/stores/default";
import {storeToRefs} from "pinia";
import {useSettingsStore} from "@/stores/settings";

const {currentPage, detailsOpen, consentSelected} = storeToRefs(useDefaultStore())
const {send_data_consent} = storeToRefs(useSettingsStore())

const process_click = () => {
  consentSelected.value = true
  currentPage.value++
}
</script>

<template>
  <v-timeline
    truncate-line="end"
    side="end"
    class="w-100"
  >
    <v-timeline-item
      size="x-large"
      :icon-color="consentSelected? 'secondary' : 'primary'"
      icon="mdi-camera-outline"
      :dot-color="consentSelected? 'primary' : 'secondary'"
    >
      <v-card class="pa-4" variant="text">
        <v-card-title>Your pictures</v-card-title>
        <p class="text-body-1">
          We would like to keep webcam pictures of your eyes whenever you click a piece in the game.
        </p>
        <p class="text-body-1">
          We combine these with information about where you're clicking to train a computer to work out
          where people are looking on the screen.
        </p>
        <p class="text-body-1 mt-4">
          Please <strong>click the button</strong> that best describes your wishes.
        </p>
        <v-item-group selected-class="bg-primary" class="mb-4" v-model="send_data_consent">
          <v-container>
            <v-row>
              <v-col
                cols="6"
              >
                <v-item :value="true" v-slot="{ selectedClass, select }">
                  <v-card
                    :class="['mx-auto', 'pa-2', selectedClass]"
                    color="primary"
                    variant="tonal"
                    height="200"
                    @click="() => {select(true); process_click()}"
                  >
                    <v-img
                      src="images/eg_left_eye.jpg"
                      height="80%"
                    />
                    <p class="text-center text-body-2 text-black">
                      Yes, keep my pictures like this
                    </p>
                  </v-card>
                </v-item>
              </v-col>
              <v-col
                cols="6"
              >
                <v-item :value="false" v-slot="{ selectedClass, select }">
                  <v-card
                    :class="['mx-auto', 'pa-2', selectedClass]"
                    height="200"
                    variant="tonal"
                    @click="() => {select(true); process_click()}"
                  >
                    <v-img
                      src="images/eg_left_eye_no.jpg"
                      height="80%"
                    />
                    <p class="text-center text-body-2">
                      No, please don't send my pictures
                    </p>
                  </v-card>
                </v-item>
              </v-col>
            </v-row>
          </v-container>
        </v-item-group>
        <p class="text-body-1">You can still play the game whichever option you choose.</p>
        <v-card-actions>
          <v-btn @click="detailsOpen = true">
            More details
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
