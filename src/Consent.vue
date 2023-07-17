<script setup lang="ts">
import ConsentSwitch from "@/ConsentSwitch.vue";
</script>

<template>
  <v-sheet color="primary">
    <h1>Welcome to the Boop-Boop Game</h1>
    <p>
      This game is brought to you by a team of psychologists, who are trying to understand
      how to work out where people are looking on a screen using images from a webcam.
    </p>
    <p>
      To find this out, we need lots and lots of webcam pictures of people looking at screens,
      and we need to know where they are looking on the screen. This game is designed to
      collect this data.
    </p>
    <p>
      In this game you will be asked to make your potato face match the target face.
      The bits you need to add to the face will flow down the sides of the screen.
      <strong>Every time you click a piece, we will take a picture with your webcam and store it,
        along with where you clicked on the screen.</strong>
      We will use the pictures to train our computer to work out where people are looking on the screen.
      We won't sell or give your pictures to anyone else.
    </p>
    <p>
      Your pictures will be sent to our server as full webcam images.
      We then take low-resolution copies of the eyes in the image, and delete the original.
      Your pictures will look like this when they are stored:
      <v-container>
        <v-row no-gutters align="center">
          <v-col
            v-for="src in ['eg_left_eye.jpg', 'eg_right_eye.jpg']"
            :key="src"
          >
            <img
              :src="`/images/${src}`"
              alt="Example of the eyes that will be stored"
            />
          </v-col>
        </v-row>
      </v-container>
    </p>
    <p>
      If you don't want to send any pictures, you can still play the game.
    </p>
    <v-sheet color="secondary">
      <ConsentSwitch />
    </v-sheet>
  </v-sheet>
</template>

<style scoped>

</style>
