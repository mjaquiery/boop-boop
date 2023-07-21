<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useDefaultStore} from "@/stores/default";

const {currentPage} = storeToRefs(useDefaultStore())
</script>

<template>
  <v-timeline
    side="end"
    truncate-line="start"
    class="w-100"
  >
    <v-timeline-item
      size="x-large"
      icon-color="secondary"
      icon="mdi-hand-wave-outline"
      dot-color="primary"
    >
      <v-card class="pa-4" color="primary" variant="tonal">
        <v-card-title>Welcome</v-card-title>
        <p class="text-body-1">
          We're going to take a few seconds to setup up the game for you.
        </p>
        <p class="text-body-1">
          We'll choose how hard the game should be,
          and we'll ask you whether you're okay with having your picture taken
          to help us with our research.
        </p>
        <v-card-actions>
          <v-btn
            color="success"
            @click="currentPage++"
            variant="elevated"
          >
            Let's begin!
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-timeline-item>
  </v-timeline>
</template>

<style scoped>
</style>
