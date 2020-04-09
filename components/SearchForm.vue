<template>
  <v-container>
    <v-row no-gutters>
      <v-col>
        <v-form lazy-validation>
          <p>Use the form below to search for the weather from a select city, choose the temperature units you want:</p>
          <v-text-field
            v-model="cityName"
            type="text"
            label="City name"
            :rules="[(v) => !!v || 'City name is required']"
            outlined
          />
          <!-- City Name Input -->

          <v-select
            v-model="tempType"
            :items="getAcceptedTempTypes"
            label="Temperature Units"
            :rules="[(v) => !!v || 'Unit is required']"
            outlined
          />
          <!-- City Name Input -->

          <v-btn :loading="isRequesting" :disabled="disabled" @click="search">Search</v-btn>
          <!-- Submit Button -->
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {
      isRequesting: false, // Flag indicating if a request is being made
      cityName: '', // Form cityName input container
      tempType: '' // Form temperature unity type select container
    }
  },

  computed: {
    ...mapGetters({
      getLastSearch: 'weather/getLastSearch',
      getAcceptedTempTypes: 'weather/getAcceptedTempTypes'
    }),

    /**
     * Returns true if cityName and tempType are incorrect values
     * @returns {Boolean}
     */
    disabled() {
      return this.cityName == null || this.cityName.trim() === '' || this.tempType == null || this.tempType === ''
    }
  },

  methods: {
    ...mapActions({
      fetchWeather: 'weather/fetchWeather'
    }),

    /**
     * Sets the requesting flag, and makes request to server for weather data for the city name provided
     */
    async search() {
      // Check values
      if (this.cityName == null || this.cityName.trim() === '') return
      if (this.tempType == null) return

      // Set request status and fetch weather
      this.isRequesting = true
      await this.fetchWeather({
        cityName: this.cityName.trim(),
        tempType: this.tempType
      })
      this.isRequesting = false
    }
  }
}
</script>
