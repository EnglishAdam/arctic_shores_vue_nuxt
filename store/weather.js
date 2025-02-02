import { v4 as uuidv4 } from 'uuid'

/**
 * Class representing a search request and response
 */
class Search {
  constructor(id, cityName, tempType) {
    this.id = id // Unique id supplied to instance
    this.cityName = cityName // Name of city user searched for
    this.tempType = tempType // Temperature unity type required
    this.date = Date.now() // Date of search
    this.response = null // Response from server
  }
}

export const state = () => ({
  // Constants
  ACCEPTED_TEMP_TYPES: ['kelvins', 'celcius', 'farenheit'], // List of accepted temperature types

  // Data Collection
  searches: {}, // Dictionary of Search instances, keyed by 'id' of search object
  searchOrderList: [], // List of Search instance ids, recordng search order

  // Search and selection
  lastSearchId: null, // Id of the last search
  lastSelectedId: null // Id of last selected (used iin history page)
})

export const getters = {
  /**
   * Gets a list of the last 5 searches ids
   * @returns {[string]} ids
   */
  getSearchIds: (state, getters) => {
    return state.searchOrderList.slice(Math.max(state.searchOrderList.length - 5, 0))
  },

  /**
   * Gets a list of the last 5 searches instances
   * @returns {[Search]} search instances
   */
  getSearches: (state, getters) => {
    // eslint-disable-next-line prettier/prettier
    return getters
    .getSearchIds
    .map((id) => getters.getSearchById(id))
  },

  /**
   * Returns a reactive function that get search instace by it's id
   * @param {string} id
   * @returns {Search|null} id
   */
  getSearchById: (state) => (id) => {
    return state.searches[id] || null
  },

  /**
   * Get last id of last search
   * @returns {string|null} id
   */
  getLastSearchId: (state) => {
    return state.lastSearchId
  },

  /**
   * Get Search instance of last search
   * @return {Search} search instance
   */
  getLastSearch: (state, getters) => {
    return getters.getSearchById(getters.getLastSearchId)
  },

  /**
   * Get id of last selected search
   * @returns {string|null} id
   */
  getLastSelectedId: (state) => {
    return state.lastSelectedId
  },

  /**
   * Get Search instance of last selected search
   * @return {Search} search instance
   */
  getLastSelected: (state, getters) => {
    return getters.getSearchById(getters.getLastSelectedId)
  },

  /**
   * Get list of accepted temperature types
   * @return {[string]} temperature types
   */
  getAcceptedTempTypes: (state, getters) => {
    return state.ACCEPTED_TEMP_TYPES
  }
}

export const mutations = {
  /**
   * Records the request data of a search sent to get the whether for a city
   * @param {*} state
   * @param {*} payload
   * @param {string} payload.id Id
   * @param {string} payload.cityName Name of the searched city
   * @param {string} payload.tempType Temperature type
   */
  recordSearch(state, payload) {
    // Check payload
    const { id, cityName, tempType } = payload
    if (id == null || cityName == null || tempType == null) {
      return console.warn('Incorrect payload sent to mutaton: weather/recordSearch', payload)
    }

    // Create search record
    const search = new Search(id, cityName, tempType)

    // Add search to dictionary
    const newSearches = state.searches
    newSearches[search.id] = search
    state.searches = Object.assign({}, newSearches) // Use assign to trigger reactivity in Vue

    // Add search to array
    const newSearchOrderList = Array.from(state.searchOrderList) // Shallow copy to help trigger reactiity in Vue
    newSearchOrderList.push(search.id)
    state.searchOrderList = newSearchOrderList
  },

  /**
   * Records the response data of a successful search request
   * @param {*} state
   * @param {*} payload
   * @param {string} payload.id Id
   * @param {string} payload.cityName Name of the searched city
   * @param {string} payload.tempType Temperature type
   */
  recordSearchResponse(state, payload) {
    // Check payload
    const { id, response } = payload
    if (id == null || response == null) {
      return console.warn('Incorrect payload sent to mutaton: weather/recordSearchResponse', payload)
    }

    // Get search instance
    const search = state.searches[id]
    if (search == null) return console.warn('Unable to record response as request not found')

    // Update search entry in dictionary
    search.response = response
    state.searches = Object.assign({}, state.searches, { [id]: search }) // Use assign to trigger reactivity in Vue
  },

  /**
   * Removes search from collection by it's id, used for cases or error
   * @param {*} state
   * @param {*} payload
   * @param {string} payload.id Id Id to remove
   */
  removeSearch(state, payload) {
    // Check payload
    const { id } = payload
    if (id == null) {
      return console.warn('Incorrect payload sent to mutaton: weather/removeSearch', payload)
    }

    // Check search instace exists
    if (state.searches[id]) {
      // Add search from dictionary
      const newSearches = state.searches
      delete newSearches[id]
      state.searches = Object.assign({}, newSearches) // Use assign to trigger reactivity in Vue

      // Add search from array, Shallow copy to help trigger reactiity in Vue
      // eslint-disable-next-line prettier/prettier
      const newSearchOrderList = Array
        .from(state.searchOrderList)
        .filter(searchId => searchId !== id)
      state.searchOrderList = newSearchOrderList
    }
  },

  /**
   * Records the last id search for by the user, this is used to find the last searched search Instance
   * @param {*} state
   * @param {*} payload
   * @param {string} payload.id Id Id to remove
   */
  setLastSearchId(state, payload) {
    // Check payload
    const { id } = payload
    if (id == null) {
      return console.warn('Incorrect payload sent to mutaton: weather/setLastSearchId', payload)
    }

    // Set value in state
    state.lastSearchId = id
  },

  /**
   * Records the last id selected by the user, this is used to find the last selected search Instance
   * @param {*} state
   * @param {*} payload
   * @param {string} payload.id Id Id to remove
   */
  setSelectedId(state, payload) {
    // Check payload
    const { id } = payload
    if (id == null) {
      return console.warn('Incorrect payload sent to mutaton: weather/setSelectedId', payload)
    }

    // Set value in state
    state.lastSelectedId = id
  },

  /**
   * Removes the last selected id, this will removed the last selected instance
   * @param {*} state
   */
  resetSelection(state) {
    // Set value in state
    state.lastSelectedId = null
  }
}

export const actions = {
  /**
   * Makes a request to the server for the weather of the supplied city name.
   * This records the search and the response. It removes the request if there is an error.
   * This sets the last search instance id.
   * This returns a flag, true if the request is successful
   * @param {*} ctx
   * @param {function} ctx.commit
   * @param {*} payload
   * @param {string} payload.cityName City name
   * @param {string} payload.tempType Temperature unity type
   * @returns {boolean} Success
   */
  async fetchWeather({ commit }, payload) {
    // Check payload
    const { cityName, tempType } = payload
    if (cityName == null) return false
    if (tempType == null) return false

    // Create unique id
    const id = uuidv4()

    // Record request data
    commit('recordSearch', { id, cityName, tempType })

    try {
      // Fetch weather data
      const response = await this.$axios.get('api/weather/' + cityName)

      // Revord response
      commit('recordSearchResponse', { id, response })
      commit('setLastSearchId', { id })
      return true
    } catch (err) {
      // Deal with error
      console.error(err)
      commit('removeSearch', { id })
      return false
    }
  },

  /**
   * Registeres an instance id as being selected.
   * @param {*} ctx
   * @param {function} ctx.commit
   * @param {*} payload
   * @param {string} payload.id
   */
  selectId({ commit }, payload) {
    // Check payload
    const { id } = payload
    if (id == null) return console.warn('Incorrect payload sent to action: weathers/selectId:', payload)

    // Set selected id
    commit('setSelectedId', { id })
  },

  /**
   * Unregisters/Resets all instance ids as being selected
   * @param {*} ctx
   * @param {function} ctx.commit
   */
  resetSelection({ commit }) {
    commit('resetSelection')
  }
}
