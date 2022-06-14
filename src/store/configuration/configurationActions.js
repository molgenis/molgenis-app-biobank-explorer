import api from '@molgenis/molgenis-api-client'

const CONFIGURATION_PATH = '/api/data/sys_App'
const APP_SELECTOR = 'label==molgenis-app-biobank-explorer'

export const configurationActions = {
  async GetApplicationConfiguration ({ commit }) {
    const response = await api.get(`${CONFIGURATION_PATH}?q=${APP_SELECTOR}`)
    commit('SetAppConfig', response)
  },
  async SaveApplicationConfiguration ({ commit, state }, appConfig) {
    commit('SetAppConfigStatus', { status: 0 })
    const response = await api.patch(`${CONFIGURATION_PATH}/${state.appConfigId}`, { body: JSON.stringify({ appConfig }) })
    commit('SetAppConfigStatus', response)
  },
  async GetApplicationContext ({ commit }) {
    const response = await api.get('/app-ui-context')
    commit('SetAppContext', response)
  }
}
