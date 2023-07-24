<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useSettingsStore} from "@/stores/settings";
import {adult_settings, child_settings, free_play_settings, Settings} from "@/assets/game_src/utils/settings";
import {computed, ref, watch} from "vue";
import ConsentSwitch from "@/components/ConsentSwitch.vue";
import {pages, useDefaultStore} from "@/stores/default";

const {currentPage, detailsOpen, settingsOpen, difficultySelected} = storeToRefs(useDefaultStore())

const emits = defineEmits(['changed'])

const {
  send_data_consent,
  difficulty_step,
  start_level,
  max_components,
  component_spawn_delay_min,
  component_spawn_delay_variation,
  component_lifetime,
  target_frequency,
  needy_potato_enabled,
  needy_potato_delay_min,
  needy_potato_delay_variation,
  needy_potato_duration
} = storeToRefs(useSettingsStore())
const {load_defaults} = useSettingsStore()

const _setting_sets = {
  child: child_settings,
  adult: adult_settings,
  free_play: free_play_settings
}

const custom_settings = ref(false);
const refresh_defaults = ref(0)
const defaults = computed({
  get: () => {
    refresh_defaults.value;
    for (const [preset, settings] of Object.entries(_setting_sets)) {
      let match = true;
      for (const [key, value] of Object.entries(all_settings.value)) {
        if (key === "send_data_consent")
          continue;
        if (!Object.keys(settings).includes(key) || settings[key as keyof Settings] !== value) {
          match = false;
          break;
        }
      }
      if (match) {
        difficultySelected.value = preset
        currentPage.value = Math.max(pages.CONSENT, currentPage.value)
        return preset;
      }
    }
    return "";
  },
  set: function(value: string) {
    if (value === "child" || value === "adult" || value === "free_play")
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
  difficulty_step: difficulty_step.value,
  start_level: start_level?.value,
  max_components: max_components.value,
  component_spawn_delay_min: component_spawn_delay_min.value,
  component_spawn_delay_variation: component_spawn_delay_variation.value,
  component_lifetime: component_lifetime.value,
  target_frequency: target_frequency.value,
  needy_potato_enabled: needy_potato_enabled.value,
  needy_potato_delay_min: needy_potato_delay_min.value,
  needy_potato_delay_variation: needy_potato_delay_variation.value,
  needy_potato_duration: needy_potato_duration.value
}))
watch(all_settings, () => {
  emits('changed')
  refresh_defaults.value++
})
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)
</script>

<template>
  <v-card class="mx-auto my-4 px-2" max-width="600">
    <v-card-title>Settings</v-card-title>

    <p class="text-body-2 mt-2">
      We would like your consent to save pictures from your webcam.
      We combine these with information about where you're clicking to train a computer to work out
      where people are looking on the screen.
    </p>
    <ConsentSwitch />

    <p class="text-body-2">
      You can use these buttons to load default settings for adults or children.
    </p>
    <v-btn-toggle
      v-model="defaults"
      class="w-100 presets"
      variant="outlined"
      color="primary"
    >
      <v-btn value="free_play" class="w-33">Free play</v-btn>
      <v-btn value="child" class="w-33">Child</v-btn>
      <v-btn value="adult" class="w-33">Adult</v-btn>
    </v-btn-toggle>

    <v-expand-transition class="advanced_settings my-4">
      <v-list v-if="custom_settings">
        <v-list-subheader :inset="true">About Pieces</v-list-subheader>
        <v-list-item>
          <v-list-item-title>
            At most <v-chip :label="true">{{ max_components }}</v-chip> Pieces onscreen at once
          </v-list-item-title>
          <v-slider
            min="0"
            max="50"
            step="1"
            v-model="max_components"
            @update:model-value="value => max_components =  clamp(value, 1, 50)"
          />
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            Pieces appear every
            <v-chip :label="true">{{ (component_spawn_delay[0] / 1000).toFixed(2) }}</v-chip>
            to <v-chip :label="true">{{ (component_spawn_delay[1] / 1000).toFixed(2) }}</v-chip>
            seconds
          </v-list-item-title>
          <v-range-slider
            min="0"
            max="10000"
            step="100"
            v-model="component_spawn_delay"
          />
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            Pieces last for
            <v-chip :label="true">{{ (component_lifetime / 1000).toFixed(2) }}</v-chip>
            seconds
          </v-list-item-title>
          <v-slider
            min="0"
            max="10000"
            step="100"
            v-model="component_lifetime"
            @update:model-value="value => component_lifetime =  clamp(value, 100, 10000)"
          />
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            Pieces are
            <v-chip :label="true">{{ (target_frequency * 100).toFixed(0) }}%</v-chip>
            likely to be useful
          </v-list-item-title>
          <v-slider
            min="0"
            max="1"
            step="0.1"
            v-model="target_frequency"
            @update:model-value="value => target_frequency =  clamp(value, 0.1, 1)"
          />
        </v-list-item>
        <v-list-subheader :inset="true">About Potato Thieves</v-list-subheader>
        <v-list-item>
          <v-list-item-title>
            Potato Thieves are <v-chip :label="true">{{ needy_potato_enabled? 'allowed' : 'not allowed'}}</v-chip>
          </v-list-item-title>
          <v-switch v-model="needy_potato_enabled" />
        </v-list-item>
        <v-list-item v-if="needy_potato_enabled">
          <v-list-item-title>
            Potato Thieves appear every
            <v-chip :label="true">{{ (needy_potato_delay[0] / 1000).toFixed(2) }}</v-chip>
            to <v-chip :label="true">{{ (needy_potato_delay[1] / 1000).toFixed(2) }}</v-chip>
            seconds
          </v-list-item-title>
          <v-range-slider
            min="0"
            max="120000"
            step="100"
            v-model="needy_potato_delay"
            @update:model-value="value => needy_potato_delay =  value.map(v => clamp(v, 200, 10000))"
          />
        </v-list-item>
        <v-list-item v-if="needy_potato_enabled">
          <v-list-item-title>
            Potato Thieves steal the potato after
            <v-chip :label="true">{{ (needy_potato_duration / 1000).toFixed(2) }}</v-chip>
            seconds
          </v-list-item-title>
          <v-slider
            min="0"
            max="30000"
            step="100"
            v-model="needy_potato_duration"
            @update:model-value="value => needy_potato_duration =  clamp(value, 200, 10000)"
          />
        </v-list-item>
        <v-list-subheader :inset="true">About the Difficulty</v-list-subheader>
        <v-list-item>
          <v-list-item-title>
            The difficulty increases by about
            <v-chip :label="true">{{ (difficulty_step * 100).toFixed(0) }}%</v-chip>
            each level
          </v-list-item-title>
          <v-slider
            min="0"
            max="0.25"
            step="0.01"
            v-model="difficulty_step"
            @update:model-value="value => difficulty_step =  clamp(value, 0.01, 0.25)"
          />
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            You start at level
            <v-chip :label="true">{{ (start_level || 0) + 1 }}</v-chip>
          </v-list-item-title>
          <v-slider
            min="0"
            max="9"
            step="1"
            v-model="start_level"
            @update:model-value="value => start_level =  clamp(value, 0, 9)"
          />
        </v-list-item>
      </v-list>
    </v-expand-transition>

    <v-card-actions>
      <v-btn @click="custom_settings = !custom_settings">
        {{ custom_settings? 'Hide advanced' : 'Show more' }} settings
      </v-btn>
      <v-spacer />
      <v-btn @click="detailsOpen = true">
        Full details
      </v-btn>
      <v-spacer />
      <v-btn
        @click="() => settingsOpen = false"
        variant="tonal"
        class="close-settings"
        color="success"
      >Close</v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.advanced_settings {
  max-height: 50vh !important;
}
.presets {
  height: 4em !important;
}
.v-slider, .v-switch {
  padding-left: 1em;
  padding-right: 1em;
}
</style>
