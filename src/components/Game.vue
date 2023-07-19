<template>
  <div id="excalibur-root">
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
    <!-- The UI will automatically be drawn above the game due to z-indexing -->
    <div id="excalibur-ui">
      <v-sheet id="excalibur-scoresheet" class="ui">
        <div class="fill-height w-50">
          <div v-if="game">
            <v-table>
              <thead>
              <tr>
                <th class="text-left">
                  Statistic
                </th>
                <th class="text-left">
                  Value
                </th>
              </tr>
              </thead>
              <tbody>
              <tr
                v-for="stat in Object.values(game!.statistics.all).filter(s => !s.advanced || advanced_stats)"
                :key="stat.name"
              >
                <td>{{ stat.name }}</td>
                <td>{{ stat.value }}</td>
              </tr>
              </tbody>
            </v-table>

            <v-btn
              @click="() => advanced_stats = !advanced_stats"
              :prepend-icon="advanced_stats? 'mdi-chevron-up' : 'mdi-chevron-down'"
            >
              {{ advanced_stats? 'Hide' : 'Show' }} Advanced stats
            </v-btn>
            <v-btn @click="() => {game!.initialize()}">Play again?</v-btn>
          </div>
        </div>
      </v-sheet>
    </div>
  </div>
</template>

<script setup lang="ts">
import GameEngine from "@/assets/game_src/main";
import {markRaw, onMounted, ref} from 'vue'
import {useSettingsStore} from "@/stores/settings";
import {DevTool} from "@excaliburjs/dev-tools";
const {to_raw} = useSettingsStore()
import { getCurrentInstance } from 'vue'
const instance = getCurrentInstance();

const forceUpdate = () => instance?.proxy?.$forceUpdate();

let game: GameEngine|null = null;
let advanced_stats = ref(false);

onMounted(() => {
  game = markRaw(new GameEngine({
    canvasElementId: "GameCanvas",
    get_settings_func: () => to_raw,
    update_wrapper: forceUpdate,
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

#excalibur-root {
  /* When this is relative, child elements positioned absolutely will
     be relative to this element, not the document providing more accurate
     positioning, since the canvas will be at (0, 0) */
  position: relative;
}

#excalibur-root #excalibur-ui {
  /* This will make the UI appear on top of the canvas */
  position: absolute;
  top: 0;
  left: 0;
}

#excalibur-root #excalibur-ui .ui {display: none;}

#excalibur-root #excalibur-ui.scoresheet #excalibur-scoresheet {
  /* This will make the UI appear on top of the canvas */
  display: block;
}
</style>
