<template>
  <v-container fill-height fluid class="pa-0">
    <v-row no-gutters class="fill-height" align="start" justify="center">
      <v-col
        :class="{ shrink: $vuetify.breakpoint.smAndDown }"
        :align-self="$vuetify.breakpoint.smAndDown"
        cols="12"
        sm="12"
        md="6"
      >
        <search-form />
        {{ $vuetify.breakpoint.smAndDown }}
      </v-col>
      <!-- 
        Left Column
       -->
      <v-col :align-self="$vuetify.breakpoint.smAndDown" sm="12" md="6">
        <pixijs />
      </v-col>
      <!-- 
        Right Column
       -->
    </v-row>
  </v-container>
</template>

<script>
import SearchForm from '~/components/SearchForm.vue'
import Pixijs from '~/components/Pixijs.vue'

export default {
  components: {
    SearchForm,
    Pixijs
  },

  head() {
    return {
      title: 'Weather Search',
      meta: [{ hid: 'description', name: 'description', content: 'Search for weather by city' }]
    }
  }
}
</script>
