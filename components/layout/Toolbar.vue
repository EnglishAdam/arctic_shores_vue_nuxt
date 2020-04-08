<template>
  <v-app-bar extended fixed app>
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
