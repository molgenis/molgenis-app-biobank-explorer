import { mockState } from '../../mockData'
import { configurationActions } from '../../../../../src/store/configuration/configurationActions'

jest.mock('@molgenis/molgenis-api-client', () => {
  return {
    get: jest.fn((url) => {
      if (url.includes('context')) {
        return { context: 'ui-context', status: 200 }
      } else { return { config: 'some config', status: 200 } }
    }),
    patch: jest.fn().mockReturnValue({ status: 204 })
  }
})

let commit, state

describe('configurationActions', () => {
  beforeEach(() => {
    commit = jest.fn()
    state = mockState()

    jest.resetModules()
  })

  it('can execute GetApplicationConfiguration', async () => {
    await configurationActions.GetApplicationConfiguration({ commit })
    expect(commit).toHaveBeenCalledWith('SetAppConfig', { config: 'some config', status: 200 })
  })

  it('can execute SaveApplicationConfiguration', async () => {
    await configurationActions.SaveApplicationConfiguration({ commit, state })

    expect(commit).toHaveBeenNthCalledWith(1, 'SetAppConfigStatus', { status: 0 })
    expect(commit).toHaveBeenNthCalledWith(2, 'SetAppConfigStatus', { status: 204 })
  })

  it('can execute GetApplicationContext', async () => {
    await configurationActions.GetApplicationContext({ commit })

    expect(commit).toHaveBeenCalledWith('SetAppContext', { context: 'ui-context', status: 200 })
  })
})
