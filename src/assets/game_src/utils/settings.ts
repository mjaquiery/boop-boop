type ComponentsSettings = {
  max_components: number;  // Maximum number of components on screen at once
  component_spawn_delay_min: number;  // Minimum delay between component spawns
  component_spawn_delay_variation: number;  // Maximum variation in component spawn delay
  component_lifetime: number;  // How long components stay on screen
  target_frequency: number;  // How frequently targets spawn (as opposed to distractors)
}

type NeedyPotatoSettings = {
  needy_potato_enabled: boolean;  // Whether needy potatoes are enabled
  needy_potato_delay_min: number;  // Minimum delay between needy potato spawns
  needy_potato_delay_variation: number;  // Maximum variation in needy potato spawn delay
  needy_potato_duration: number;  // How long needy potatoes allow for interaction
}

// Keep this flat so that it can be safely mutated by the settings store
export type Settings = {
  game_mode: "matching" | "free_play";  // The game mode
  send_data_consent?: boolean;  // Whether to send data to the server
  start_level?: number;  // The level to start at
  difficulty_step: number;  // How much to increase difficulty by each level
  music_change_delay: number;  // How frequently the music changes
} & ComponentsSettings & NeedyPotatoSettings

export const adult_settings: Settings = {
  game_mode: "matching",
  start_level: 0,
  difficulty_step: 0.1,
  max_components: 20,
  component_spawn_delay_min: 500,
  component_spawn_delay_variation: 200,
  component_lifetime: 2000,
  target_frequency: 1 / 5,
  music_change_delay: 60000,
  needy_potato_enabled: true,
  needy_potato_delay_min: 5000,
  needy_potato_delay_variation: 2500,
  needy_potato_duration: 5000,
}

export const child_settings: Settings = {
  game_mode: "matching",
  start_level: 0,
  difficulty_step: 0.05,
  max_components: 10,
  component_spawn_delay_min: 1000,
  component_spawn_delay_variation: 500,
  component_lifetime: 5000,
  target_frequency: 1 / 3,
  music_change_delay: 60000,
  needy_potato_enabled: true,
  needy_potato_delay_min: 10000,
  needy_potato_delay_variation: 5000,
  needy_potato_duration: 6000,
}

export const free_play_settings: Settings = {
  game_mode: "free_play",
  start_level: 0,
  difficulty_step: 0,
  max_components: 10,
  component_spawn_delay_min: 1000,
  component_spawn_delay_variation: 500,
  component_lifetime: 5000,
  target_frequency: 0,
  music_change_delay: 60000,
  needy_potato_enabled: false,
  needy_potato_delay_min: 0,
  needy_potato_delay_variation: 0,
  needy_potato_duration: 0,
}

export const settings: Settings = child_settings;
