import Vue from 'vue'
import VueRouter from 'vue-router'
import BiobankExplorer from '../views/BiobankExplorer'
import Landingpage from '../views/Landingpage'
import BiobankReport from '../views/BiobankReport'
import CollectionReport from '../views/CollectionReport'
import NetworkReportCard from '../components/cards/NetworkReportCard'
import state, { INITIAL_STATE } from '../store/state'
import api from '@molgenis/molgenis-api-client'

Vue.use(VueRouter)
const router = new VueRouter({
  mode: 'hash',
  base: INITIAL_STATE.baseUrl,
  routes: [
    {
      path: '/catalogue',
      component: BiobankExplorer
    },
    {
      path: '/biobank/report/:id',
      redirect: '/biobank/:id'
    },
    {
      path: '/biobank/:id',
      name: 'biobank',
      component: BiobankReport
    },
    {
      path: '/collection/:id',
      name: 'collection',
      component: CollectionReport
    },
    {
      path: '/network/:id',
      name: 'network',
      component: NetworkReportCard
    },
    {
      path: '/configuration',
      component: () => import(/* webpackChunkName: "configuration-screen" */ '../views/ConfigurationScreen'),
      beforeEnter: async (to, from, next) => {
        const response = await api.get('/app-ui-context')
        if (response.roles.includes('ROLE_SU')) { next() } else next('/')
      }
    },
    {
      path: '/',
      component: Landingpage,
      beforeEnter: async (to, from, next) => {
        if (state.landingpage.enabled && !Object.keys(to.query).length) {
          next()
        } else {
          next({ path: '/catalogue', query: to.query })
        }
      }
    }
  ]
})

export default router
