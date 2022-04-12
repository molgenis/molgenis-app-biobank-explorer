import { bbmriConfig } from '../../../../src/config/configManager'
import initialBiobankColumns from '../../../../src/config/initialBiobankColumns'
import initialCollectionColumns from '../../../../src/config/initialCollectionColumns'

let windowSpy

const initialState = {
  collectionColumns: initialCollectionColumns,
  biobankColumns: initialBiobankColumns,
  customCollectionFilterFacets: [],
  removeFreemarkerMargin: true,
  menuHeight: 50
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
