<template>
  <v-row>
    <v-col v-for="(item, i) in items" :key="i" class="shrink">
      <v-btn :to="item.to" text>
        {{ item.title }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      // Navigation items
      items: [
        {
          title: 'Weather Search',
          icon: 'search',
          to: 'search'
        },
        {
          title: 'History',
          icon: 'history',
          to: 'history'
        }
      ]
    }
  }
}
</script>
