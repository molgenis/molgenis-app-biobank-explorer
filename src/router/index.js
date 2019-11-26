import Vue from 'vue'
import VueRouter from 'vue-router'
import BiobankExplorerContainer from '../components/BiobankExplorerContainer'
import BiobankReportCard from '../components/cards/BiobankReportCard'
import CollectionReportCard from '../components/cards/CollectionReportCard'
import NetworkReportCard from '../components/cards/NetworkReportCard'
import { INITIAL_STATE } from '../store/state'

Vue.use(VueRouter)
export default new VueRouter({
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
    {
      path: '/network/report/:id',
      component: NetworkReportCard
    },
    { path: '/', redirect: '/biobankexplorer' }
  ]
})
