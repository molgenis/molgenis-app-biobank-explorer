import 'es6-promise/auto'

import Vue from 'vue'
import store from './store'
import router from './router'
import i18n from '@molgenis/molgenis-i18n-js/dist/molgenis-i18n.esm'

import { sync } from 'vuex-router-sync'
import { INITIAL_STATE } from './store/state'

import App from './App'
import VueAnalytics from 'vue-analytics'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap-vue/dist/bootstrap-vue.css'

if (INITIAL_STATE.GA_KEY) {
  Vue.use(VueAnalytics, {
    id: INITIAL_STATE.GA_KEY,
    router,
    // TODO Use MOLGENIS settings for this
    set: [
      { field: 'forceSSL', value: true },
      { field: 'anonymizeIp', value: true }
    ],
    autoTracking: {
      transformQueryString: true
    }
  })
}

sync(store, router)

if (window.__webpack_public_path__) {
  /* eslint-disable no-undef, camelcase */
  __webpack_public_path__ = window.__webpack_public_path__ // NOSONAR
  /* eslint-enable */
}

Vue.use(i18n, {
  lng: INITIAL_STATE.lng,
  fallbackLng: INITIAL_STATE.fallbackLng,
  namespace: 'biobank-explorer',
  callback () {
    /* eslint-disable no-new */
    new Vue({
      render: h => h(App),
      store,
      router,
      components: { App }
    }).$mount('#app')
  }
})

Vue.use(BootstrapVue)
