import api from '@molgenis/molgenis-api-client'
import helpers from '../../../../src/store/helpers'
import { mockGetFilterDefinitions, mockState, baseGetters, mockFilterOptionDictionary, mockFilterLoadingDict } from '../mockData'
import { createFilters } from '../../../../src/config/facetConfigurator'
import filterDefinitions from '../../../../src/config/initialFilterFacets'
import actions from '../../../../src/store/actions'
import Vuex from 'vuex'


jest.mock('@molgenis/molgenis-api-client', () => {
  return {
    post: jest.fn(),
    get: jest.fn()
  }
})
let commit, state, dispatch

describe('store', () => {
  beforeEach(() => {
    commit = jest.fn()
    dispatch = jest.fn()
    state = mockState()
  })

  describe('actions', () => {
    describe('GetBiobanks', () => {
      it('should retrieve biobanks from the server and store them in state', async () => {
        const response = {
          items: [
            { id: '1', name: 'biobank-1' },
            { id: '2', name: 'biobank-2' },
            { id: '3', name: 'biobank-3' }
          ]
        }

        api.get.mockResolvedValueOnce(response)
        const requestedBiobankIds = ['1', '2', '3']

        await actions.GetBiobanks({ commit }, requestedBiobankIds)
        expect(commit).toHaveBeenCalledWith('SetBiobanks', [{ id: '1', name: 'biobank-1' }, { id: '2', name: 'biobank-2' }, { id: '3', name: 'biobank-3' }])
      })
    })

    describe('SendToNegotiator', () => {
      let state
      let getters

      beforeEach(() => {
        state = mockState()
        state.negotiatorCollectionEntityId = 'eu_bbmri_eric_collections'
        state.filters.selections.search = 'Cell&Co'
        state.filters.selections.materials = ['CELL_LINES']
        state.filters.labels.materials = ['Cell Lines']
        getters = {
          rsql: 'materials=in=(CELL_LINES);name=q="Cell&Co"',
          getFilterDefinitions: mockGetFilterDefinitions,
          activeFilters: state.filters.selections,
          selectedCollections: [{ label: 'Collection A', value: 'collection1' }, { text: 'Collection B', value: 'collection4' }],
          biobanks: [
            { id: 'biobank1', collections: [{ id: 'collection1' }, { id: 'collection2' }] },
            { id: 'biobank2', collections: [{ id: 'collection3' }, { id: 'collection4' }] }
          ]
        }
        helpers.setLocationHref = jest.fn()
      })

      it('should send a negotiator query to the server and then surf to the negotiator', async () => {
        api.post.mockResolvedValueOnce('test')
        await actions.SendToNegotiator({ state, getters, commit })
        expect(helpers.setLocationHref).toBeCalledWith('test')
      })

      it('should commit the error if the server response was bad', async () => {
        api.post.mockRejectedValueOnce('test error')
        await actions.SendToNegotiator({ state, getters, commit })
        expect(commit).toBeCalledWith('SetError', 'test error')
      })
    })

    describe('QueryBiobanks', () => {
      it('should retrieve biobank ids from the server based on biobank filters', async () => {
        const response = {
          items: [
            { data: { id: 'biobank-1' } },
            { data: { id: 'biobank-2' } }
          ]
        }
        api.get.mockResolvedValueOnce(response)

        const getters = { biobankRsql: 'covid19=in=(covid19)' }

        await actions.QueryBiobanks({ state, commit, getters })
        expect(commit.mock.calls[1]).toEqual(['SetBiobankIds', ['biobank-1', 'biobank-2']])
      })
    })

    describe('GetCollectionInfo', () => {
      const response = {
        items: [
          { data: { id: 'c1', biobank: { links: { self: 'https://directory.bbmri-eric.eu/api/data/eu_bbmri_eric_biobanks/b1' } } } },
          { data: { id: 'c2', biobank: { links: { self: 'https://directory.bbmri-eric.eu/api/data/eu_bbmri_eric_biobanks/b2' } } } }
        ]
      }

      it('should set the collection info, create a dictionary and map query to the state', async () => {
        api.get.mockResolvedValueOnce(response)
        const getters = { rsql: 'country=in=(NL,BE)' }

        await actions.GetCollectionInfo({ state, commit, getters, dispatch })

        expect(dispatch).toHaveBeenCalledWith('initializeCollectionRelationData')
        expect(commit.mock.calls[0]).toEqual(['SetCollectionInfo', undefined])
        expect(commit.mock.calls[1]).toEqual(['SetCollectionInfo', response])
      })
    })

    describe('GetBiobankReport', () => {
      it('should retrieve a single biobank entity from the server based on a biobank id and store it in the state', async () => {
        const response = {
          _meta: {
            name: 'biobank'
          },
          id: 'biobank-1'
        }

        api.get.mockResolvedValueOnce(response)
        const biobankId = 'biobank-1'

        await actions.GetBiobankReport({ commit, state }, biobankId)

        expect(commit).toHaveBeenNthCalledWith(1, 'SetLoading', true)
        expect(commit).toHaveBeenNthCalledWith(2, 'SetBiobankReport', response)
        expect(commit).toHaveBeenNthCalledWith(3, 'SetLoading', false)
      })

      it('should return biobank from state if it is already there', async () => {
        const alreadyPresentBiobank =
          { id: 'biobank' }

        state.allBiobanks = [
          alreadyPresentBiobank
        ]

        await actions.GetBiobankReport({ commit, state }, 'biobank')

        expect(commit).toHaveBeenCalledWith('SetBiobankReport', alreadyPresentBiobank)
      })
    })
    describe('GetCollectionReport', () => {
      it('should retrieve a single collection entity from the server based on a collection id and store it in the state', async () => {
        const response = {
          _meta: {
            name: 'meta'
          },
          id: '001',
          name: 'beautiful collection',
          description: 'beautiful samples'
        }

        api.get.mockResolvedValueOnce(response)
        const collectionId = '001'

        await actions.GetCollectionReport({ commit, state }, collectionId)

        expect(commit).toHaveBeenNthCalledWith(1, 'SetLoading', true)
        expect(commit).toHaveBeenNthCalledWith(2, 'SetCollectionReport', response)
        expect(commit).toHaveBeenNthCalledWith(3, 'SetLoading', false)
      })
    })

    describe('GetNetworkReport', () => {
      const neverReturningPromise = new Promise(() => { })
      const collectionError = new Error('No way!')
      it('should set error', async () => {
        api.get.mockResolvedValueOnce(neverReturningPromise)
        api.get.mockResolvedValueOnce(neverReturningPromise)
        api.get.mockRejectedValueOnce(collectionError)

        const networkId = '001'

        await actions.GetNetworkReport({ commit }, networkId)

        expect(commit).toHaveBeenNthCalledWith(1, 'SetNetworkBiobanks', undefined)
        expect(commit).toHaveBeenNthCalledWith(2, 'SetNetworkCollections', undefined)
        expect(commit).toHaveBeenNthCalledWith(3, 'SetNetworkReport', undefined)
        expect(commit).toHaveBeenNthCalledWith(4, 'SetLoading', true)
        expect(commit).toHaveBeenNthCalledWith(5, 'SetError', collectionError)
      })

      it('should load network', async () => {
        const network = {
          _meta: {
            name: 'meta'
          },
          id: '001',
          name: 'beautiful network',
          description: 'beautiful data'
        }
        api.get.mockResolvedValueOnce(network)
        api.get.mockResolvedValueOnce(undefined)
        api.get.mockResolvedValueOnce(undefined)

        const networkId = '001'

        await actions.GetNetworkReport({ commit }, networkId)

        expect(commit).toHaveBeenCalledWith('SetNetworkBiobanks', undefined)
        expect(commit).toHaveBeenCalledWith('SetNetworkCollections', undefined)
        expect(commit).toHaveBeenCalledWith('SetNetworkReport', undefined)
        expect(commit).toHaveBeenCalledWith('SetLoading', true)
        expect(commit).toHaveBeenCalledWith('SetNetworkReport', network)
        expect(commit).toHaveBeenCalledWith('SetLoading', false)
      })

      it('should retrieve the collections and biobanks of a network from the server based on a network id and store them in the state', async () => {
        api.get.mockResolvedValueOnce(undefined)
        api.get.mockResolvedValueOnce({ items: [{ id: 'col-1' }] })
        api.get.mockResolvedValueOnce({ items: [{ id: 'bb-1' }] })

        const networkId = '001'

        await actions.GetNetworkReport({ commit }, networkId)

        expect(commit).toHaveBeenCalledWith('SetNetworkBiobanks', undefined)
        expect(commit).toHaveBeenCalledWith('SetNetworkCollections', undefined)
        expect(commit).toHaveBeenCalledWith('SetNetworkReport', undefined)
        expect(commit).toHaveBeenCalledWith('SetLoading', true)
        expect(commit).toHaveBeenCalledWith('SetNetworkCollections', [{ id: 'col-1' }])
        expect(commit).toHaveBeenCalledWith('SetNetworkBiobanks', [{ id: 'bb-1' }])
        expect(commit).toHaveBeenCalledWith('SetLoading', false)
      })
    })
  })

  describe('AddCollectionsToSelection', () => {
    const collections = [{
      id: 'Test Collection A',
      label: 'Mock Collection A'
    },
    {
      id: 'Test Collection B',
      label: 'Mock Collection B'
    }]
    const getters = {
      getHumanReadableString: 'Using a mock selection'
    }

    it('calls SetCollectionToSelection and SetSearchHistory', () => {
      actions.AddCollectionsToSelection({ commit, getters }, { collections })

      expect(commit).toHaveBeenCalledWith('SetCollectionsToSelection', { bookmark: undefined, collections })
      expect(commit).toHaveBeenCalledWith('SetSearchHistory', getters.getHumanReadableString)
    })
  })

  describe('reduce filter options', () => {

    let store
    const filters = createFilters({ filterFacets: filterDefinitions, filters: { selections: {}, satisfyAll: [] } })
    const filterLoadingDict = {'materials': '/api/data/eu_bbmri_eric_collections?size=1&filter=id&q=materials=in=(DNA)'}

    beforeEach(() => {
      store = new Vuex.Store({
        state: { ...mockState(), filterFacets: filters, filterLoadingDict: filterLoadingDict },
        getters: {
          ...baseGetters,
          loading: () => false,
          foundCollectionIds: () => [],
          selectedCollections: () => [],
          activeFilters: () => ({}),
          activeSatisfyAll: () => [],
        }
      })
    })

    it('calls resetFilterLoading and resetFilterOptionsOverride', async () => {
      const filterName = 'country'
      const activeFilters = []

      await actions.getReducedFilterOptions({ state, commit }, { filterName, activeFilters })

      expect(commit).toHaveBeenCalledWith('ResetFilterLoading')
      expect(commit).toHaveBeenCalledWith('ResetFilterOptionsOverride', { filterName:filterName, reducedFilterOptions:[] })
    })

    it('calls setFilterLoading and then SetUpdateFilter', async () => {

      const response = {
        page: { totalElements: 2 }
      }
      
      api.get.mockResolvedValueOnce(response)

      const filterName = 'country'
      const activeFilters = {'materials' : ['DNA']}
      state.filterOptionDictionary = mockFilterOptionDictionary

      await actions.getReducedFilterOptions({ state, commit }, { filterName, activeFilters })

      expect(commit).toHaveBeenCalledWith('SetFilterLoading', { filterName:filterName })
      expect(commit).toHaveBeenCalledWith('SetUpdateFilter', { filterName:filterName, reducedFilterOptions: ['AT'], lastBaseQuery: '/api/data/eu_bbmri_eric_collections?size=1&filter=id&q=materials=in=(DNA);' })
    })

    it('should not call SetFIlterLoading if the constructed query url equals the last constructed query url for the same filter', async () => {
      
      const filterName = 'country'
      const activeFilters = {'materials' : ['DNA']}
      state.filterOptionDictionary = mockFilterOptionDictionary
      state.filterLoadingDict = mockFilterLoadingDict

      await actions.getReducedFilterOptions({ state, commit }, { filterName, activeFilters })
      expect(commit).not.toHaveBeenCalledWith('SetFilterLoading', expect.anything())
    })

    it('should commit the error if the server response was bad', async () => {
      const filterName = 'country'
      const activeFilters = {'materials' : ['DNA']}
      const filterReductionError = new Error('No way!')
      state.filterOptionDictionary = mockFilterOptionDictionary

      api.get.mockRejectedValueOnce(filterReductionError)
      await actions.getReducedFilterOptions({ state, commit }, { filterName, activeFilters })

      expect(commit).toBeCalledWith('SetError', filterReductionError)
    })
  })
})
