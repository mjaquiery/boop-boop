<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useSettingsStore} from "@/stores/settings";
import {pages, useDefaultStore} from "@/stores/default";

const {send_data_consent} = storeToRefs(useSettingsStore())
const {currentPage} = storeToRefs(useDefaultStore())

const update = (value: boolean) => {
  send_data_consent.value = value
  currentPage.value = pages.GAME
}
</script>

<template>
  <v-switch
    class="d-flex justify-center"
    :inset="true"
    :indeterminate="send_data_consent === undefined"
    v-bind="send_data_consent"
    @change="update"
    :color="send_data_consent? 'success' : ''"
    label="I consent to my pictures being stored"
  />
</template>

<style scoped>

</style>
