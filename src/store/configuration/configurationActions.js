import api from '@molgenis/molgenis-api-client'

const CONFIGURATION_PATH = '/api/data/sys_App'
const APP_SELECTOR = 'label==molgenis-app-biobank-explorer'

export const configurationActions = {
  async GetApplicationConfiguration ({ commit }) {
    const response = await api.get(`${CONFIGURATION_PATH}?q=${APP_SELECTOR}`)
    console.log(response)
    commit('SetAppConfig', response)
  }

}
