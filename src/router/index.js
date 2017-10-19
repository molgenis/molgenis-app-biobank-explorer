import Vue from 'vue'
import Router from 'vue-router'
import BiobankExplorerContainer from 'components/BiobankExplorerContainer'
import BiobankReportCard from 'components/cards/BiobankReportCard'
import { INITIAL_STATE } from '../store/state'

Vue.use(Router)
export default new Router({
  mode: 'history',
  base: INITIAL_STATE.baseUrl,
  routes: [
    {
      name: 'biobanks',
      path: '/biobanks',
      component: BiobankExplorerContainer
    },
    {
      name: 'biobank-report',
      path: '/biobanks/:id',
      component: BiobankReportCard
    },
    // catch all redirect
    { path: '/', redirect: '/biobanks' }
  ]
})
