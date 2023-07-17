<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useSettingsStore} from "@/stores/settings";
import {adult_settings, child_settings, Settings} from "@/assets/game_src/settings";
import {computed, ref, watch} from "vue";
import ConsentSwitch from "@/ConsentSwitch.vue";
import {useDefaultStore} from "@/stores/default";

const {settingsOpen} = storeToRefs(useDefaultStore())

const {
  send_data_consent,
  max_components,
  component_spawn_delay_min,
  component_spawn_delay_variation,
  component_lifetime,
  target_frequency,
  needy_potato_delay_min,
  needy_potato_delay_variation,
  needy_potato_duration
} = storeToRefs(useSettingsStore())
const {load_defaults} = useSettingsStore()

const custom_settings = ref(false);
const refresh_defaults = ref(0)
const defaults = computed({
  get: () => {
    refresh_defaults.value;
    let child = true;
    let adult = true;
    for (const [key, value] of Object.entries(all_settings.value)) {
      if (key === "send_data_consent")
        continue;
      if (!Object.keys(child_settings).includes(key) || child_settings[key as keyof Settings] !== value)
        child = false;
      if (!Object.keys(adult_settings).includes(key) || adult_settings[key as keyof Settings] !== value)
        adult = false;
    }
    if (adult)
      return "adult";
    if (child)
      return "child";
    return "";
  },
  set: function(value: string) {
    if (value === "child" || value === "adult")
      load_defaults(value)
  }
})
const component_spawn_delay = computed({
  get: () => [
    component_spawn_delay_min.value,
    component_spawn_delay_min.value + component_spawn_delay_variation.value
  ],
  set: (value: number[]) => {
    if (value[0] > value[1])
      value = [value[1], value[0]]
    component_spawn_delay_min.value = value[0]
    component_spawn_delay_variation.value = value[1] - value[0]
  }
})
const needy_potato_delay = computed({
  get: () => [
    needy_potato_delay_min.value,
    needy_potato_delay_min.value + needy_potato_delay_variation.value
  ],
  set: (value: number[]) => {
    if (value[0] > value[1])
      value = [value[1], value[0]]
    needy_potato_delay_min.value = value[0]
    needy_potato_delay_variation.value = value[1] - value[0]
  }
})
const all_settings = computed(() => ({
  send_data_consent: send_data_consent?.value,
  max_components: max_components.value,
  component_spawn_delay_min: component_spawn_delay_min.value,
  component_spawn_delay_variation: component_spawn_delay_variation.value,
  component_lifetime: component_lifetime.value,
  target_frequency: target_frequency.value,
  needy_potato_delay_min: needy_potato_delay_min.value,
  needy_potato_delay_variation: needy_potato_delay_variation.value,
  needy_potato_duration: needy_potato_duration.value
}))
watch(all_settings, () => refresh_defaults.value++)
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)
</script>

<template>
  <h1>Settings</h1>
  <ConsentSwitch />
  <v-btn-toggle v-model="defaults">
    <v-btn value="child">Child settings</v-btn>

    <v-btn value="adult">Adult settings</v-btn>
  </v-btn-toggle>

  <v-divider />

  <v-btn @click="custom_settings = !custom_settings" variant="text">
    <v-icon v-if="custom_settings">mdi-chevron-down</v-icon>
    <v-icon v-else>mdi-chevron-right</v-icon>
    <h2>Customise settings</h2>
  </v-btn>

  <v-sheet v-if="custom_settings" class="w-100 mb-16">
    <h3>Component settings</h3>
    <div class="text-caption">Maximum number of pieces onscreen at once</div>
    <v-slider
      min="0"
      max="50"
      step="1"
      thumb-label="always"
      v-model="max_components"
      @update:model-value="value => max_components =  clamp(value, 1, 50)"
    />
    <div class="text-caption">How often do pieces appear?</div>
    <v-range-slider
      min="0"
      max="10000"
      step="100"
      thumb-label="always"
      v-model="component_spawn_delay"
    />
    <div class="text-caption">How long do pieces last?</div>
    <v-slider
      min="0"
      max="10000"
      step="100"
      thumb-label="always"
      v-model="component_lifetime"
      @update:model-value="value => component_lifetime =  clamp(value, 100, 10000)"
      suffix="ms"
    />
    <div class="text-caption">How likely are pieces to be useful?</div>
    <v-slider
      min="0"
      max="1"
      step="0.1"
      thumb-label="always"
      v-model="target_frequency"
      @update:model-value="value => target_frequency =  clamp(value, 0.1, 1)"
    />
    <h3>Needy Potato settings</h3>
    <div class="text-caption">How often do pieces fall off?</div>
    <v-range-slider
      min="0"
      max="10000"
      step="100"
      thumb-label="always"
      v-model="needy_potato_delay"
      @update:model-value="value => needy_potato_delay =  value.map(v => clamp(v, 200, 10000))"
    />
    <div class="text-caption">How long do you have to stop pieces falling off?</div>
    <v-slider
      min="0"
      max="10000"
      step="100"
      thumb-label="always"
      v-model="needy_potato_duration"
      @update:model-value="value => needy_potato_duration =  clamp(value, 200, 10000)"
      suffix="ms"
    />
  </v-sheet>
  <v-btn
    @click="() => settingsOpen = false"
    variant="tonal"
    prepend-icon="mdi-check"
    :block="true"
    class="close-settings"
  >Close</v-btn>
</template>

<style scoped>
.v-slider {
  width: 90%;
}
.v-divider {
  margin: 1rem;
}
.close-settings {
  position: absolute;
  bottom: 1rem;
  width: 100%;
}
</style>
