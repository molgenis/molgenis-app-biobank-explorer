import Vue from 'vue'
import Vuex from 'vuex'

import state from './state'
import mutations from './mutations'
import getters from './getters'
import actions from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  strict: process.env.NODE_ENV !== 'production'
})

Vue.filter('replace_specials', function (value) {
  // eslint-disable-next-line
  return value.replace(/[^a-zA-Z0-9]/g, '_')
})
