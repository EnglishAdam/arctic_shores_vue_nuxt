<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters>
      <v-col>
        <v-list dense>
          <v-list-item v-for="item in getSearches" :key="item.id" dense @click="select(item)">
            <v-list-item-content>
              <v-list-item-title>{{ item.cityName }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.date | date }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon>mdi-chevron-right</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import moment from 'moment'
import { mapGetters, mapActions } from 'vuex'
export default {
  filters: {
    date(value) {
      return moment(value).format('HH:mm DD/MM/YYYY')
    }
  },

  computed: {
    ...mapGetters({
      getSearches: 'weather/getSearches'
    })
  },

  mounted() {
    // Unselect
    this.resetSelection()
  },

  methods: {
    ...mapActions({
      selectId: 'weather/selectId',
      resetSelection: 'weather/resetSelection'
    }),

    select(item) {
      // Check item
      const { id } = item
      if (id == null) return

      // Select item
      this.selectId({ id })
    }
  }
}
</script>
