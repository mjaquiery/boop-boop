<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useSettingsStore} from "@/stores/settings";

const {send_data_consent} = storeToRefs(useSettingsStore())
</script>

<template>
  <v-switch
    class="d-flex justify-center"
    :inset="true"
    :indeterminate="send_data_consent === undefined"
    v-model="send_data_consent"
    :color="send_data_consent? 'success' : ''"
    label="I consent to my pictures being stored"
  />
</template>

<style scoped>

</style>
