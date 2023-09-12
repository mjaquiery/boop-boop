import { defineStore } from 'pinia'
import {
  settings as _settings,
  adult_settings,
  child_settings,
  free_play_settings,
  Settings
} from "@/assets/game_src/utils/settings";

export const useSettingsStore = defineStore('game', {
  state: () => ({..._settings, send_data_consent: undefined as boolean | undefined}),
  getters: {
    to_raw: (state: Settings) => ({
      game_mode: state.game_mode,
      send_data_consent: state.send_data_consent,
      difficulty_step: state.difficulty_step,
      start_level: state.start_level,
      max_components: state.max_components,
      component_spawn_delay_min: state.component_spawn_delay_min,
      component_spawn_delay_variation: state.component_spawn_delay_variation,
      component_lifetime: state.component_lifetime,
      target_frequency: state.target_frequency,
      music_change_delay: state.music_change_delay,
      needy_potato_delay_min: state.needy_potato_delay_min,
      needy_potato_delay_variation: state.needy_potato_delay_variation,
      needy_potato_duration: state.needy_potato_duration,
    })
  },
  actions: {
    _update_from_object: function (obj: Settings) {
      for (const [key, value] of Object.entries(obj)) {
        if (key in this) {
          // @ts-ignore
          this[key as keyof Settings] = value as Settings[keyof Settings];
        }
      }
    },
    load_defaults: function (type: "adult" | "child" | "free_play" = "adult") {
      if (type === "adult")
        this._update_from_object(adult_settings);
      else if (type === "child")
        this._update_from_object(child_settings);
      else if (type === "free_play")
        this._update_from_object(free_play_settings);
    }
  },
})
