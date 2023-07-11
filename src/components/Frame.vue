<script setup lang="ts">
  import {ref} from 'vue'
  import {VCarouselItem} from "vuetify/components/VCarousel";
  defineSlots<VCarouselItem>()

  const model = ref(0)

  function increment() {
    model.value = Math.max(0, model.value + 1)
  }
  function decrement() {
    model.value--
  }
</script>

<template>
  <v-carousel hide-delimiters v-model="model">
    <slot />
    <template v-slot:prev="{ props }">
      <v-btn
        :hidden="model === 0"
        variant="elevated"
        color="success"
        @click="props.onClick"
      >Previous slide</v-btn>
    </template>
    <template v-slot:next="{ props }">
      <v-btn
        :hidden="model === ($slots.default.length - 1)"
        variant="elevated"
        color="info"
        @click="props.onClick"
      >Next slide</v-btn>
    </template>
  </v-carousel>
</template>

<style scoped>

</style>
