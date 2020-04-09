<template>
  <v-row>
    <v-col v-for="(item, i) in items" :key="i" class="shrink">
      <v-btn :to="item.to" text>
        {{ item.title }}
      </v-btn>
    </v-col>
  </v-row>
  <!-- Navigation Row -->
</template>

<script>
export default {
  data() {
    return {
      /**
       * Items used for route navigation
       */
      items: [
        {
          title: 'Weather Search',
          to: 'search'
        },
        {
          title: 'History',
          to: 'history'
        }
      ]
    }
  }
}
</script>
