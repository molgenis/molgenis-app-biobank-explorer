import Vue from 'vue'
import Vuex from 'vuex'

import state from './state'
import mutations from './mutations'
import getters from './getters'
import actions from './actions'

Vue.use(Vuex)

// https://github.com/vuejs/vuex/issues/1748
export default {
  state,
  mutations,
  actions,
  getters,
  strict: process.env.NODE_ENV !== 'production'
}
