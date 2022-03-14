
export const configurationMutations = {
  SetAppConfig (state, response) {
    state.appConfig = response.items[0].data.appConfig
  }
}
