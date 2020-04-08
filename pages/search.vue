<template>
  <v-container v-if="!$vuetify.breakpoint.smAndDown" fill-height fluid class="pa-0 align-start">
    <v-row no-gutters class="fill-height" align="start" justify="center">
      <v-col cols="6">
        <search-form />
      </v-col>
      <!-- Left Column -->

      <v-col class="fill-height grey lighten-3" cols="6">
        <pixijs :search="getLastSearch" />
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
        <search-form />
        {{ $vuetify.breakpoint.smAndDown }}
      </v-col>
    </v-row>
    <!-- Top Row -->

    <v-divider></v-divider>

    <v-row no-gutters class="fill-height grey lighten-3">
      <v-col cols="12">
        <pixijs :search="getLastSearch" />
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
import SearchForm from '~/components/SearchForm.vue'
import Pixijs from '~/components/Pixijs.vue'

export default {
  layout: 'main',

  components: {
    SearchForm,
    Pixijs
  },

  computed: {
    ...mapGetters({
      getLastSearch: 'weather/getLastSearch'
    })
  },

  head() {
    return {
      title: 'Weather Search',
      meta: [{ hid: 'description', name: 'description', content: 'Search for weather by city' }]
    }
  }
}
</script>
