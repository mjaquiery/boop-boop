<template>
  <canvas id="GameCanvas" />
  <v-btn :ref="(el) => console.log">Start!</v-btn>
</template>

<script setup lang="ts">
  import GameEngine from "@/assets/game_src/main.ts";
  import {markRaw, onMounted, ref} from 'vue'
  import {useSettingsStore} from "@/stores/settings";
  const {to_raw} = useSettingsStore()

  const button = ref<HTMLButtonElement|null>(null);
  let game: GameEngine|null = null;

  onMounted(() => {
    game = markRaw(new GameEngine({
      canvasElementId: "GameCanvas",
      startButtonElement: button.value as HTMLButtonElement,
      get_settings_func: () => to_raw
    }));
    game?.initialize();
  })
</script>
