import state from '../../../src/store/state'
export const INITIAL_STATE = window.__INITIAL_STATE__ || {}

export const mockState = () => JSON.parse(JSON.stringify(mockStateTemplate))

const mockStateTemplate = {
// some tests need this, but it's not on the state ??
  route: {
    query: {}
  },
  ...state
}
