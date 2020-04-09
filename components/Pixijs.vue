<template>
  <div id="pixi-app" v-resize="onResize" style="width: 100%; height: 100%">
    <div style="width: 100%; height: 100%; position: absolute; z-index: 1000;">
      <v-container fluid fill-height class="pa-0">
        <v-row no-gutters align="center" justify="center">
          <v-col class="pa-12">
            <v-card flat color="transparent">
              <p v-if="getCityName" class="headline white--text">City: {{ getCityName }}</p>
              <p v-if="getDescription" class="headline white--text">Description: {{ getDescription }}</p>
              <p v-if="getTemp" class="headline white--text">Temperature: {{ getTempWithType | temp }}</p>
            </v-card>
            <!-- Text Card -->
          </v-col>
        </v-row>
      </v-container>
    </div>
    <!-- Text Overlay -->
  </div>
  <!-- Pixi Container -->
</template>

<script>
import * as PIXI from 'pixi.js'

export default {
  filters: {
    /**
     * Temperature filter takes both the supplied temperature (Kelvin)
     * Returns sppied temperature unit type
     * @param {*} value
     * @param {number} value.temp Temperature in kelvin
     * @param {string} value.type Temperature unit type
     * @returns {string} Temperature with strung
     */
    temp({ temp, type }) {
      switch (type) {
        case 'celcius':
          return Number(temp - 273.15).toFixed(2) + ' °C'
        case 'farenheit':
          return Number(((temp - 273.15) * 9) / 5 + 32).toFixed(2) + ' °F'
        default:
          return Number(temp).toFixed(2) + ' °K'
      }
    }
  },

  props: {
    // Instance of the search object
    search: {
      type: Object,
      default: () => null
    }
  },

  data() {
    return {
      app: null, // Container for pixi application
      tickCount: 0, // Counts tick, used to check if scene change (i.e. tickCount === 0 as tickCount is reset to 0)

      // Image containers
      cloud: null,
      rain: null,
      rays: null,
      sun: null,
      wind: null
    }
  },

  computed: {
    /**
     * Returns the name of the searched city or null
     * @returns {string|null} City name
     */
    getCityName() {
      return (this.search && this.search.cityName) || null
    },

    /**
     * Returns the temperature unit type
     * @returns {string|null} Temperature unit type
     */
    getTempType() {
      return (this.search && this.search.tempType) || null
    },

    /**
     * Returns the successful response retrieved via the API if avaialable
     * @returns {*|null} Reponse
     */
    getResponse() {
      // Get response and check for status
      const response = (this.search && this.search.response) || null
      if (response == null) return null
      if (response.status !== 200) return null
      return response
    },

    /**
     * Returns the weather description of the successful response
     * @returns {string|null} Reponse
     */
    getDescription() {
      const response = this.getResponse
      const weather = (response && response.data && response.data.weather && response.data.weather[0]) || null
      return (weather && weather.description) || null
    },

    /**
     * Returns the weather 'main' keyword of the successful response
     * This keyword is used to work out what weather animation to show
     * @returns {string|null} Reponse
     */
    getMain() {
      const response = this.getResponse
      const weather = (response && response.data && response.data.weather && response.data.weather[0]) || null
      return (weather && weather.main) || null
    },

    /**
     * Returns the weather temparature of the successful response
     * @returns {string|null} Reponse
     */
    getTemp() {
      const response = this.getResponse
      return (response && response.data && response.data.main && response.data.main.temp) || null
    },

    /**
     * Returns the filter object used to get the temperature type in the filter method
     * @returns {*} { temp, type }
     */
    getTempWithType() {
      return {
        temp: this.getTemp,
        type: this.getTempType
      }
    }
  },

  watch: {
    /**
     * Triggered when the description changes
     * @param {string} value The new value
     */
    getDescription(value) {
      // Reset tickcount
      this.tickCount = 0

      // Hide all of the sprites
      this.hideAll()
    }
  },

  mounted() {
    // Create and attach the default application to the component
    this.app = new PIXI.Application()
    const div = document.getElementById('pixi-app')
    div.appendChild(this.app.view)

    // Reset sizing
    // eslint-disable-next-line prettier/prettier
    this.app.renderer.backgroundColor = 0xD8D8D8
    this.app.renderer.view.style.position = 'absolute'
    this.app.renderer.view.style.display = 'block'
    this.app.renderer.autoResize = true
    this.app.renderer.resize(div.clientWidth, div.clientHeight)

    // Add textures
    const loader = new PIXI.Loader()
    loader
      .add('cloud', './images/cloud.png')
      .add('rain', './images/rain.png')
      .add('rays', './images/rays.png')
      .add('sun', './images/sun.png')
      .add('wind', './images/wind.png')
      .load((loader, resources) => {
        // Create resources and record with coponent
        this.cloud = new PIXI.Sprite(resources.cloud.texture)
        this.rain = new PIXI.TilingSprite(resources.rain.texture)
        this.rays = new PIXI.Sprite(resources.rays.texture)
        this.sun = new PIXI.Sprite(resources.sun.texture)
        this.wind = new PIXI.TilingSprite(resources.wind.texture)

        // Add sprites to the stage container
        this.app.stage.addChild(this.cloud)
        this.app.stage.addChild(this.rain)
        this.app.stage.addChild(this.rays)
        this.app.stage.addChild(this.sun)
        this.app.stage.addChild(this.wind)

        // Hide all sprites to start
        this.hideAll()

        // Set ticker
        this.app.ticker.add((delta) => this.ticker(this.app, delta))
      })
  },

  methods: {
    /**
     * Called when the pixi container is resized via the v-resize directive
     */
    onResize() {
      // Check app exists, as this is called during the mounting process
      // See v-resize directive in html component
      if (this.app) {
        const div = document.getElementById('pixi-app')
        this.app.renderer.autoResize = true
        this.app.renderer.resize(div.clientWidth, div.clientHeight)

        // Correct for sprites if they exists
        if (this.rain) {
          this.rain.width = this.app.renderer.width
          this.rain.height = this.app.renderer.height + 256
        }

        if (this.wind) {
          this.wind.width = this.app.renderer.width + 256
          this.wind.height = this.app.renderer.height
        }
      }
    },

    /**
     * Sets all sprites as hidden
     */
    hideAll() {
      if (this.cloud) this.cloud.visible = false
      if (this.rain) this.rain.visible = false
      if (this.rays) this.rays.visible = false
      if (this.sun) this.sun.visible = false
      if (this.wind) this.wind.visible = false
    },

    /**
     * Triggers relevant ticker related to the weather
     * Used to split up animations into 'scenes'
     */
    ticker(app, delta) {
      // Call relevent Tick
      switch (this.getMain) {
        case 'Thunderstorm':
        case 'Drizzle':
        case 'Rain':
        case 'Snow':
        case 'Mist':
        case 'Smoke':
        case 'Haze':
        case 'Dust':
        case 'Fog':
        case 'Sand':
        case 'Ash':
        case 'Squall':
          this.rainTicker(app, delta)
          break
        case 'Clouds':
          this.cloudTicker(app, delta)
          break
        case 'Clear':
          this.sunTicker(app, delta)
          break
        case 'Tornado':
          this.windTicker(app, delta)
          break
        default:
          this.emptyTicker(app, delta)
      }

      // Increment tick
      this.tickCount += 1
    },

    /**
     * Animation ticker for cloudy weather
     * @param {*} app Pixi Application
     * @param {number} delta Render frame change delta
     */
    cloudTicker(app, delta) {
      // SETUP
      if (this.tickCount === 0) {
        // Set background
        // eslint-disable-next-line prettier/prettier
        app.renderer.backgroundColor = 0x5E5E5E

        // Setup sprite
        this.cloud.width = 256
        this.cloud.height = 256
        this.cloud.x = (app.renderer.width - this.cloud.width) / 2
        this.cloud.y = 128

        // Set sprite as visible
        this.cloud.visible = true
      }

      // ANIMATE
      // Move cloud left
      this.cloud.x += delta * -5

      // When cloud heads off left screen, position to right
      if (this.cloud.x <= -this.cloud.width) {
        this.cloud.x = app.renderer.width + this.cloud.width
      }
    },

    /**
     * Animation ticker for rainy weather
     * @param {*} app Pixi Application
     * @param {number} delta Render frame change delta
     */
    rainTicker(app, delta) {
      // SETUP
      if (this.tickCount === 0) {
        // Set background
        // eslint-disable-next-line prettier/prettier
        app.renderer.backgroundColor = 0x061639

        // Setup rain sprite
        this.rain.width = app.renderer.width
        this.rain.height = app.renderer.height + 256
        this.rain.x = 0
        this.rain.y = -256

        // Set sprite as visible
        this.rain.visible = true
      }

      // ANIMATE
      this.rain.y += delta * 5

      // Reset rain tile when has moved it's height
      if (this.rain.y >= 0) {
        this.rain.y = this.rain.y = -256
      }
    },

    /**
     * Animation ticker for sunny weather
     * @param {*} app Pixi Application
     * @param {number} delta Render frame change delta
     */
    sunTicker(app, delta) {
      // SETUP
      if (this.tickCount === 0) {
        // Set background
        // eslint-disable-next-line prettier/prettier
        app.renderer.backgroundColor = 0x3CA4B0

        // Setup sun sprite
        this.sun.width = 256
        this.sun.height = 256
        this.sun.x = app.renderer.width - 256
        this.sun.y = 0

        // Setup rays sprite
        this.rays.width = 256
        this.rays.height = 256
        this.rays.x = app.renderer.width - 128
        this.rays.y = 128
        this.rays.pivot.x = this.rays.width / 2
        this.rays.pivot.y = this.rays.height / 2

        // Set sprites as visible
        this.sun.visible = true
        this.rays.visible = true
      }

      // ANIMATE
      // Rotat sun rays
      this.rays.rotation += 0.01
    },

    /**
     * Animation ticker for windy weather
     * @param {*} app Pixi Application
     * @param {number} delta Render frame change delta
     */
    windTicker(app, delta) {
      // SETUP
      if (this.tickCount === 0) {
        // Set background
        // eslint-disable-next-line prettier/prettier
        app.renderer.backgroundColor = 0x172E10

        // Setup wind sprite
        this.wind.width = app.renderer.width + 256
        this.wind.height = app.renderer.height
        this.wind.x = 0
        this.wind.y = 0

        // Set sprite as visible
        this.wind.visible = true
      }

      // ANIMATE
      this.wind.x += delta * -5

      // Reset wind when it has moved it's width
      if (this.wind.x <= -256) {
        this.wind.x = this.wind.x = 0
      }
    },

    /**
     * Animation ticker for no weather
     * @param {*} app Pixi Application
     * @param {number} delta Render frame change delta
     */
    emptyTicker(app, delta) {
      // Set to new background
      app.renderer.backgroundColor = 0x061639
    }
  }
}
</script>
