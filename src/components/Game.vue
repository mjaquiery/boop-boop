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
        <div id="excalibur-ui" class="w-100 d-flex align-center justify-center fill-height" ref="ui">
            <v-sheet id="excalibur-scoresheet" class="ui">
                <v-card class="pa-2">
                    <v-card-title>Game statistics</v-card-title>
                    <v-card-text v-if="updateTrigger">
                        <v-table>
                            <thead>
                            <tr>
                                <th class="text-left">

                                </th>
                                <th class="text-right" v-if="last_score" :class="!highscore || (last_score!.score.value > highscore!.score.value)? 'high' : ''">
                                    Last game
                                </th>
                                <th class="text-right" v-if="highscore">
                                    Your highscore
                                </th>
                            </tr>
                            </thead>
                            <tbody v-if="last_score">
                            <tr
                                    v-for="stat in Object.values(last_score).filter(s => !s.advanced || advanced_stats)"
                                    :key="stat.name"
                            >
                                <td
                                        class="text-left"
                                        :class="!highscore || (stat.value > get_highscore(stat)!.value)? 'high' : ''"
                                >
                                    {{ get_name_with_unit(stat as Statistic) }}
                                </td>
                                <td
                                        class="text-right"
                                        :class="!highscore || (stat.value > get_highscore(stat)!.value)? 'high' : ''"
                                >
                                    {{ get_display_value(stat as Statistic) }}
                                </td>
                                <td class="text-right"  v-if="highscore">{{ get_display_value(get_highscore(stat as Statistic)) }}</td>
                            </tr>
                            </tbody>
                        </v-table>

                        <v-card-actions>
                            <v-btn @click="() => advanced_stats = !advanced_stats">
                                {{ advanced_stats? 'Hide' : 'Show' }} Advanced stats
                            </v-btn>
                            <v-spacer />
                            <v-btn prepend-icon="mdi-play" variant="tonal" color="success" @click="() => {
            ui?.classList.remove('scoresheet')
            game!.initialize()
          }">Play again?</v-btn>
                        </v-card-actions>
                    </v-card-text>
                </v-card>
            </v-sheet>
            <v-sheet id="excalibur-splashscreen" class="ui">
                <v-card v-if="updateTrigger" :loading="true" class="pa-2">
                    <v-card-title class="text-center">
                        <h1 class="text-h3">
                          Level {{ game!.difficulty_level + 1 }}
                        </h1>
                    </v-card-title>
                    <v-card-subtitle class="text-center">
                        <h2 class="text-h6">
                            Mode: {{ (difficultySelected || "custom").toUpperCase() }}
                        </h2>
                    </v-card-subtitle>
                    <v-card-text>
                        <v-list lines="three" class="text-start">
                            <v-list-item
                                    title="Match the potato"
                            >
                                <template v-slot:prepend>
                                    <v-icon size="x-large">mdi-gesture-tap-button</v-icon>
                                </template>
                                <template v-slot:subtitle>
                                    <strong>Make your potato match the potato at the top</strong> of the screen
                                    by clicking on the correct pieces as they appear.
                                </template>
                            </v-list-item>
                            <v-list-item
                                    title="Be quick"
                            >
                                <template v-slot:prepend>
                                    <v-icon size="x-large">mdi-timer-alert-outline</v-icon>
                                </template>
                                <template v-slot:subtitle>
                                    Each level will get harder, because the <strong>pieces will disappear</strong> more quickly.
                                </template>
                            </v-list-item>
                            <v-list-item
                                    title="Watch out"
                            >
                                <template v-slot:prepend>
                                    <v-icon size="x-large">mdi-ufo-outline</v-icon>
                                </template>
                                <template v-slot:subtitle>
                                    Watch out for the <strong>Potato Thieves</strong> who are trying to steal
                                    your potato. If they steal your potato, it's <strong>game over</strong>.
                                </template>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn
                                variant="flat"
                                color="success"
                                @click="() => game?.loadPotatoMatching()"
                                :block="true"
                        >Play!</v-btn>
                        <v-spacer />
                    </v-card-actions>
                </v-card>
            </v-sheet>
        </div>
    </div>
    <v-card-actions>
        <v-btn
                @click="settingsOpen = true"
                variant="plain"
        >Change settings</v-btn>
        <v-spacer />
        <v-btn
                @click="detailsOpen = true"
                variant="plain"
        >Details</v-btn>
        <v-spacer />
        <v-btn
                @click="currentPage = pages.WELCOME"
                variant="plain"
        >Back to the intro</v-btn>
    </v-card-actions>
</template>

<script setup lang="ts">
import GameEngine from "@/assets/game_src/main";
import {computed, markRaw, onMounted, ref, watch} from 'vue'
import {useSettingsStore} from "@/stores/settings";
import {DevTool} from "@excaliburjs/dev-tools";
import {GameStatisticsSummary, Statistic} from "@/assets/game_src/utils/Statistics";
import {pages, useDefaultStore} from "@/stores/default";
import {storeToRefs} from "pinia";
const {to_raw} = useSettingsStore()
const {currentPage, settingsOpen, detailsOpen, difficultySelected} = storeToRefs(useDefaultStore())

const ui = ref<HTMLDivElement|null>(null)
const advanced_stats = ref(false);
const updateTrigger = ref(0)
const forceUpdate = () => updateTrigger.value++;
let game: GameEngine|null = null;
let last_score: GameStatisticsSummary|null = null;
let highscore: GameStatisticsSummary|null = null;

onMounted(() => {
    game = markRaw(new GameEngine({
        canvasElementId: "GameCanvas",
        get_settings_func: () => to_raw,
        update_wrapper: forceUpdate,
    }));
    game?.initialize();
    // new DevTool(game);
})

watch(updateTrigger, () => {
    if (!game) return;
    last_score = game.last_game_score;
    highscore = game.highscore;
})

const get_highscore: (stat: Statistic) => Statistic|null = (stat: Statistic) => {
    if (!highscore) return null;
    const out = Object.values(highscore).find((s: Statistic) => s.name === stat.name)
    if (!out) return null;
    return out;
}

const get_display_value: (stat: Statistic|null) => string = (stat: Statistic|null) => {
    if (!stat) return '';
    const v = stat.value % 1 > 0? stat.value.toFixed(2) : stat.value.toString()
    return v.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const get_name_with_unit: (stat: Statistic) => string = (stat: Statistic) => {
    return stat.unit? `${stat.name} (${stat.unit})` : stat.name;
}
</script>

<style>
div {position: relative;}

#GameCanvas {
    cursor: pointer;
}

#excalibur-play-root {
    position: absolute;
    top: unset !important;
    left: unset !important;
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
    /* Flexbox used to center game */
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
    min-width: 300px;
}

#excalibur-root #excalibur-ui {
    /* This will make the UI appear on top of the canvas */
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
}
#excalibur-root #excalibur-ui.enabled {
    z-index: 1;
}

#excalibur-root #excalibur-ui .ui {
    display: none;

    max-width: 600px;
    width: 100%;
}

#excalibur-root #excalibur-ui.scoresheet #excalibur-scoresheet {
    /* This will make the UI appear on top of the canvas */
    display: block;
}
#excalibur-root #excalibur-ui.splashscreen #excalibur-splashscreen {
    /* This will make the UI appear on top of the canvas */
    display: block;
}

.high {
    font-weight: bold;
}
</style>
