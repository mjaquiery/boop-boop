<template>
  <div>
    <canvas id="GameCanvas" />
    <div
      id="excalibur-play-root"
      class="d-flex justify-center align-center fill-height"
    >
      <v-btn
        id="excalibur-play"
      >
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
  import GameEngine from "@/assets/game_src/main";
  import {markRaw, onMounted} from 'vue'
  import {useSettingsStore} from "@/stores/settings";
  import {DevTool} from "@excaliburjs/dev-tools";
  const {to_raw} = useSettingsStore()

  let game: GameEngine|null = null;

  onMounted(() => {
    game = markRaw(new GameEngine({
      canvasElementId: "GameCanvas",
      get_settings_func: () => to_raw
    }));
    game?.initialize();
    // new DevTool(game);
  })
</script>

<style>
div {position: relative;}
#excalibur-play-root {
  left: 0 !important;
  top: -6em !important;
}
#excalibur-play {
  display: none;
  height: 2em;
  padding: 1rem 1.5rem !important;
}
#excalibur-play:before {
  display: none !important;
}
#excalibur-play:after {
  display: none !important;
}
</style>
