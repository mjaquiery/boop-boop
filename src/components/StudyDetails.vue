<script setup lang="ts">
import {storeToRefs} from "pinia";
import {useDefaultStore} from "@/stores/default";

const detailsOpen = storeToRefs(useDefaultStore()).detailsOpen
</script>

<template>
  <v-card class="mx-auto my-4 px-4 text-justify" max-width="600">
    <v-card-title>Details</v-card-title>
    <v-sheet class="pe-2">
      <h2 class="text-h6 pt-4">Lorem ipsum</h2>
      <p class="text-body-1 pt-2">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Id aliquet risus feugiat in. Convallis convallis tellus id interdum velit laoreet id. Metus dictum at tempor commodo ullamcorper a lacus. Adipiscing tristique risus nec feugiat in fermentum posuere. Non pulvinar neque laoreet suspendisse interdum consectetur. Orci sagittis eu volutpat odio facilisis mauris sit amet massa. Scelerisque fermentum dui faucibus in ornare quam viverra. Sed arcu non odio euismod lacinia at quis risus sed. Ac ut consequat semper viverra nam libero justo. Fermentum posuere urna nec tincidunt. Scelerisque eleifend donec pretium vulputate sapien nec sagittis aliquam malesuada. Egestas erat imperdiet sed euismod nisi porta. In nulla posuere sollicitudin aliquam. Sed risus ultricies tristique nulla. Viverra maecenas accumsan lacus vel facilisis volutpat est velit. Et netus et malesuada fames ac turpis. Sit amet risus nullam eget felis.
      </p>
      <p class="text-body-1 pt-2">
        Viverra nam libero justo laoreet sit. Arcu dictum varius duis at consectetur. Risus commodo viverra maecenas accumsan lacus. Ullamcorper morbi tincidunt ornare massa eget. In dictum non consectetur a erat nam. Feugiat nisl pretium fusce id velit ut. Sit amet consectetur adipiscing elit ut. Sit amet risus nullam eget felis eget nunc lobortis mattis. Nunc mi ipsum faucibus vitae aliquet nec ullamcorper. Ornare suspendisse sed nisi lacus. Neque sodales ut etiam sit amet. Mauris commodo quis imperdiet massa tincidunt nunc pulvinar sapien et. Vel turpis nunc eget lorem dolor sed viverra ipsum. Sapien et ligula ullamcorper malesuada. Scelerisque eu ultrices vitae auctor eu. Odio tempor orci dapibus ultrices in. Quis blandit turpis cursus in hac habitasse platea dictumst quisque.
      </p>
      <p class="text-body-1 pt-2">
        Purus ut faucibus pulvinar elementum integer enim neque. Amet nisl purus in mollis nunc sed id semper risus. Varius vel pharetra vel turpis nunc eget lorem dolor. Nulla facilisi nullam vehicula ipsum a. Tristique senectus et netus et. Nullam non nisi est sit amet facilisis. Morbi tincidunt augue interdum velit euismod in. Mattis enim ut tellus elementum. Id volutpat lacus laoreet non curabitur gravida arcu ac tortor. Eget mi proin sed libero enim sed faucibus. Sed viverra ipsum nunc aliquet. Auctor urna nunc id cursus. A condimentum vitae sapien pellentesque.
      </p>
      <h2 class="text-h6 pt-4">Adipiscing elit</h2>
      <p class="text-body-1 pt-2">
        Adipiscing elit duis tristique sollicitudin nibh sit. Facilisi cras fermentum odio eu. Auctor augue mauris augue neque gravida in fermentum et sollicitudin. Curabitur gravida arcu ac tortor dignissim convallis. Massa sed elementum tempus egestas sed sed risus. Nunc lobortis mattis aliquam faucibus purus in. Faucibus purus in massa tempor. Ultrices eros in cursus turpis massa tincidunt dui ut. Lectus magna fringilla urna porttitor rhoncus dolor purus. Nisl pretium fusce id velit. Nibh sed pulvinar proin gravida.
      </p>
      <p class="text-body-1 pt-2">
        Dui nunc mattis enim ut tellus elementum sagittis vitae et. Pellentesque dignissim enim sit amet venenatis urna cursus. Vestibulum lectus mauris ultrices eros in. Hendrerit dolor magna eget est lorem ipsum dolor sit. Libero justo laoreet sit amet cursus sit amet dictum. Integer eget aliquet nibh praesent tristique magna sit amet. Nec ultrices dui sapien eget mi proin. Accumsan tortor posuere ac ut consequat semper. Purus gravida quis blandit turpis. Non pulvinar neque laoreet suspendisse.
      </p>
    </v-sheet>
    <v-card-actions>
      <v-btn prepend-icon="mdi-email" color="primary">
        Ask us for more information
      </v-btn>
      <v-spacer />
      <v-btn
        @click="detailsOpen = false"
        variant="tonal"
        class="close-settings"
        color="success"
      >Close</v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.v-sheet {max-height: 80%; overflow-y: auto}
</style>
