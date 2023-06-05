import { bbmriConfig } from '../../../../src/config/configManager'
import initialBiobankColumns from '../../../../src/config/initialBiobankColumns'
import initialCollectionColumns from '../../../../src/config/initialCollectionColumns'
import filterDefinitions from '../../../../src/config/initialFilterFacets'
import initialLandingpage from '../../../../src/config/initialLandingpage'
import i18n from '../../../../src/config/i18n'

let windowSpy

const initialState = {
  collectionColumns: initialCollectionColumns,
  biobankColumns: initialBiobankColumns,
  biobankCardShowCollections: true,
  filterFacets: filterDefinitions,
  removeFreemarkerMargin: true,
  negotiatorType: 'eric-negotiator',
  landingpage: initialLandingpage,
  menuHeight: 50,
  filterMenuInitiallyFolded: false,
  i18n
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
