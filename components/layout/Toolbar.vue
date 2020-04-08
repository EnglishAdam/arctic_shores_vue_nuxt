<template>
  <v-app-bar color="blue darken-3" extended dark app>
    <v-toolbar-title>
      JavaScript Challenge
    </v-toolbar-title>

    <template #extension>
      <sidebar />
    </template>
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
