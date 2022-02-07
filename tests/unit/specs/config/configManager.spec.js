import { bbmriConfig } from '../../../../src/config/configManager'
import initialCollectionColumns from '../../../../src/config/initialCollectionColumns'

let windowSpy

const initialState = {
  disabledFilters: ['country'],
  collectionColumns: initialCollectionColumns,
  customCollectionFilterFacets: [],
  removeFreemarkerMargin: true
}

describe('Config Manager', () => {
  beforeEach(() => {
    windowSpy = jest.spyOn(window, 'window', 'get')
  })

  afterEach(() => {
    windowSpy.mockRestore()
  })

  it('can extract data from the initial state', () => {
    windowSpy.mockImplementation(() => ({
      __INITIAL_STATE__: initialState
    }))

    expect(bbmriConfig()).toStrictEqual(initialState)
  })
})
