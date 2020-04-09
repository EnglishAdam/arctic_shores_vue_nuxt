<template>
  <v-app-bar color="blue darken-3" extended dark app>
    <v-toolbar-title>
      JavaScript Challenge
    </v-toolbar-title>
    <!-- Application title -->

    <template #extension>
      <sidebar />
    </template>
    <!-- Extension template slot -->
  </v-app-bar>
</template>

<script>
import Sidebar from '~/components/layout/Sidebar.vue'

export default {
  components: {
    Sidebar
  }
}
</script>
