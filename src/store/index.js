import Vue from 'vue'
import Vuex from 'vuex'

import state from './state'
import mutations from '@/store/mutations'
import getters from '@/store/getters'
import actions from '@/store/actions'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  strict: process.env.NODE_ENV !== 'production'
})
