<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useDefaultStore} from "@/stores/default";

const detailsOpen = storeToRefs(useDefaultStore()).detailsOpen
</script>

<template>
  <v-card class="mx-auto my-4 px-2" max-width="600">
    <v-card-title>Details</v-card-title>

    <v-card-actions>
      <v-spacer />
      <v-btn
        @click="detailsOpen = false"
        variant="tonal"
        class="close-settings"
        color="success"
      >Close</v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.v-slider {
  padding-left: 1em;
  padding-right: 1em;
}
</style>
