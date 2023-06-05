
export const configurationMutations = {
  SetAppConfig (state, response) {
    state.appConfigId = response.items[0].data.id
    state.appConfig = response.items[0].data.appConfig
  },
  SetAppContext (state, response) {
    state.applicationContext = response
  },
  SetAppConfigStatus (state, response) {
    state.configUpdateStatus = response.status
  },
  UpdateLandingpage (state, config) {
    state.landingpage = config.landingpage
  }
}
