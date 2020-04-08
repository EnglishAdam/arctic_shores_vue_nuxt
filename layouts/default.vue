<template>
  <v-app>
    <layout-toolbar />

    <v-content>
      <nuxt />
      <!-- Main Route -->
    </v-content>

    <layout-footer />
  </v-app>
</template>

<script>
import Toolbar from '~/components/layout/Toolbar.vue'
import Footer from '~/components/layout/Footer.vue'

export default {
  middleware: ['redirect'],

  components: {
    'layout-toolbar': Toolbar,
    'layout-footer': Footer
  }
}
</script>
