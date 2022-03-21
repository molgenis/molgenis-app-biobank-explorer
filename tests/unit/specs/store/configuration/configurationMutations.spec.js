import { configurationMutations } from '../../../../../src/store/configuration/configurationMutations'
import { mockState } from '../../mockData'
let state

describe('configurationMutation', () => {
  beforeEach(() => {
    state = mockState()
  })

  it('can execute SetAppConfig', () => {
    configurationMutations.SetAppConfig(state, { items: [{ data: { id: 'myId', appConfig: { test: 'config' } } }] })
    expect(state.appConfigId).toBe('myId')
    expect(state.appConfig).toStrictEqual({ test: 'config' })
  })

  it('can execute SetAppContext', () => {
    configurationMutations.SetAppContext(state, { context: 'myContext' })
    expect(state.applicationContext).toStrictEqual({ context: 'myContext' })
  })

  it('can execute SetAppConfigStatus', () => {
    configurationMutations.SetAppConfigStatus(state, { status: 418 })
    expect(state.configUpdateStatus).toBe(418)
  })
})
