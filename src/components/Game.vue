<template>
  <canvas id="GameCanvas" />
</template>

<script setup lang="ts">
  import GameEngine from "@/assets/game_src/main.ts";
  import {markRaw, onMounted} from 'vue'

  const props = defineProps<{consent?: boolean}>()

  let game: GameEngine|null = null;

  onMounted(() => {
    game = markRaw(new GameEngine({canvasElementId: "GameCanvas", consent: !!props.consent}));
    game?.initialize();
  })
</script>
