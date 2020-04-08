<template>
  <v-container v-if="!$vuetify.breakpoint.smAndDown" fill-height fluid class="pa-0 align-start">
    <v-row no-gutters class="fill-height" align="start" justify="center">
      <v-col cols="6">
        <history />
      </v-col>
      <!-- Left Column -->

      <v-col class="fill-height grey lighten-3" cols="6">
        <pixijs :search="getLastSelected" />
      </v-col>
      <!-- Right Column -->
    </v-row>
  </v-container>
  <!-- 
    Medium and large devices
  -->

  <v-container v-else fill-height fluid class="pa-0 align-start">
    <v-row no-gutters>
      <v-col cols="12">
        <history />
        {{ $vuetify.breakpoint.smAndDown }}
      </v-col>
    </v-row>
    <!-- Top Row -->

    <v-divider></v-divider>

    <v-row no-gutters class="fill-height grey lighten-3">
      <v-col cols="12">
        <pixijs :search="getLastSelected" />
      </v-col>
    </v-row>
    <!-- Top Row -->
  </v-container>
  <!-- 
    Small devices and below
  -->
</template>

<script>
import { mapGetters } from 'vuex'
import History from '~/components/History.vue'
import Pixijs from '~/components/Pixijs.vue'

export default {
  layout: 'main',

  components: {
    History,
    Pixijs
  },

  computed: {
    ...mapGetters({
      getLastSelected: 'weather/getLastSelected'
    })
  },

  head() {
    return {
      title: 'Search History',
      meta: [{ hid: 'description', name: 'description', content: 'Weather search histroy.' }]
    }
  }
}
</script>
