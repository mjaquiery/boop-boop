<template>
  <v-app>
    <v-app-bar :elevation="2" color="primary">
      <v-toolbar-title>Boop-Boop Game</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-information-outline</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container class="fill-height">
        <v-responsive class="align-center text-center fill-height">
          <v-carousel
            hide-delimiters
            :show-arrows="consent !== undefined"
            class="fill-height"
            :continuous="false"
          >

            <v-carousel-item>
              <Consent :granted="consent" @change="(v) => typeof v === 'boolean' && (consent = v)"/>
            </v-carousel-item>

            <v-carousel-item>
              <Game :consent="consent"/>
            </v-carousel-item>

          </v-carousel>
        </v-responsive>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
  import {VCarouselItem} from "vuetify/components/VCarousel";
  import Game from "@/components/Game.vue";
  import Consent from "@/Consent.vue";
  import {Ref, ref} from "vue";

  const consent: Ref<boolean|undefined> = ref(undefined)

</script>
