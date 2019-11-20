import Vue from 'vue'
import Router from 'vue-router'
import BiobankExplorerContainer from '../components/BiobankExplorerContainer'
import BiobankReportCard from '../components/cards/BiobankReportCard'
import CollectionReportCard from '../components/cards/CollectionReportCard'
import { INITIAL_STATE } from '../store/state'

Vue.use(Router)
export default new Router({
  mode: 'history',
  base: INITIAL_STATE.baseUrl,
  routes: [
    {
      path: '/biobankexplorer',
      component: BiobankExplorerContainer
    },
    {
      path: '/biobank/report/:id',
      component: BiobankReportCard
    },
    {
      path: '/collection/report/:id',
      component: CollectionReportCard
    },
    { path: '/', redirect: '/biobankexplorer' }
  ]
})
