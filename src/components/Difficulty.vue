<script setup lang="ts">
import {useDefaultStore} from "@/stores/default";
import {storeToRefs} from "pinia";
import {useSettingsStore} from "@/stores/settings";

const {currentPage, difficultySelected, settingsOpen} = storeToRefs(useDefaultStore())
const {load_defaults} = useSettingsStore()

const process_click = (value: "adult"|"child") => {
  if (!value) return

  load_defaults(value)
  currentPage.value++
}
</script>

<template>
  <v-timeline

    side="end"
    class="w-100"
  >
    <v-timeline-item
      size="x-large"
      :icon-color="difficultySelected? 'secondary' : 'primary'"
      icon="mdi-cog-outline"
      :dot-color="difficultySelected? 'primary' : 'secondary'"
    >
      <v-card class="pa-4" variant="text">
        <v-card-title>About you</v-card-title>
        <p class="text-body-1 mt-4">
          Please <strong>click the button</strong> that best describes you.
        </p>
        <v-item-group selected-class="bg-primary" class="mb-4" v-model="difficultySelected">
          <v-container>
            <v-row>
              <v-col
                cols="6"
              >
                <v-item value="child" v-slot="{ selectedClass, select }">
                  <v-card
                    :class="['mx-auto', 'py-2', selectedClass]"
                    color="primary"
                    variant="tonal"
                    height="200"
                    @click="() => {select(true); process_click('child')}"
                  >
                    <v-img
                      src="images/potato_04.png"
                      height="80%"
                    ></v-img>
                    <v-card-title class="text-center text-black">
                      Child
                    </v-card-title>
                  </v-card>
                </v-item>
              </v-col>
              <v-col
                cols="6"
              >
                <v-item value="adult" v-slot="{ selectedClass, select }">
                  <v-card
                    :class="['mx-auto', 'py-2', selectedClass]"
                    color="primary"
                    height="200"
                    variant="tonal"
                    @click="() => {select(true); process_click('adult')}"
                  >
                    <v-img
                      src="images/potato_03.png"
                      height="80%"
                    ></v-img>
                    <v-card-title class="text-center text-black">
                      Adult
                    </v-card-title>
                  </v-card>
                </v-item>
              </v-col>
            </v-row>
          </v-container>
        </v-item-group>
        <v-card-actions>
          <v-btn
            @click="() => {settingsOpen = true; difficultySelected = true; currentPage++}"
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
