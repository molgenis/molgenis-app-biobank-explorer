import api from '@molgenis/molgenis-api-client'
import utils from '@molgenis/molgenis-vue-test-utils'
import helpers from '../../../../src/store/helpers'
import { mockGetFilterDefinitions, mockState } from '../mockData'
import actions from '../../../../src/store/actions'

jest.mock('@molgenis/molgenis-api-client', () => {
  return {
    post: jest.fn(),
    get: jest.fn()
  }
})

describe('store', () => {
  describe('actions', () => {
    describe('GetBiobanks', () => {
      it('should retrieve biobanks from the server and store them in state', (done) => {
        const response = {
          items: [
            { id: '1', name: 'biobank-1' },
            { id: '2', name: 'biobank-2' },
            { id: '3', name: 'biobank-3' }
          ]
        }

        api.get.mockResolvedValueOnce(response)
        const options = {
          payload: ['id1', 'id2'],
          expectedMutations: [
            { type: 'SetBiobanks', payload: response.items }
          ]
        }
        utils.testAction(actions.GetBiobanks, options, done)
      })
    })

    describe('SendToNegotiator', () => {
      let state
      let getters
      const commit = jest.fn()
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

    describe('GetBiobankIds', () => {
      it('should retrieve biobank ids from the server based on biobank filters', async () => {
        const response = {
          items: [
            { data: { id: 'biobank-1' } },
            { data: { id: 'biobank-2' } }
          ]
        }
        api.get.mockResolvedValueOnce(response)

        const getters = { biobankRsql: 'covid19=in=(covid19)' }
        const commit = jest.fn()

        await actions.GetBiobankIds({ commit, getters })
        expect(commit.mock.calls[1]).toEqual(['SetBiobankIds', ['biobank-1', 'biobank-2']])
      })
    })

    describe('GetBiobankIdsForQuality', () => {
      let state
      beforeEach(() => {
        state = mockState()
      })
      it('should retrieve biobank ids from the server based on biobank quality filters and true SatisfyAll', async () => {
        const response = {
          items: [
            {
              biobank: { id: 'biobank-1' },
              quality_standard: { id: 'iso-15189', label: 'ISO 15189:2012' },
              assess_level_bio: { id: 'eric', label: 'BBMRI-ERIC audited' }
            },
            {
              biobank: { id: 'biobank-1' },
              quality_standard: { id: 'iso-17043-2010', label: 'ISO 17043:2010' },
              assess_level_bio: { id: 'accredited', label: 'Certified by accredited body' }
            }
          ]
        }
        api.get.mockResolvedValueOnce(response)
        state.filters.selections.biobank_quality = ['accredited', 'eric']
        state.filters.satisfyAll = ['biobank_quality']
        const commit = jest.fn()

        await actions.GetBiobankIdsForQuality({ state, commit })
        expect(commit.mock.calls[0]).toEqual(['SetBiobankIdsWithSelectedQuality', response])
      })

      it('should retrieve biobank ids from the server based on biobank quality filters and false SatisfyAll', async () => {
        const response = {
          items: [
            {
              biobank: { id: 'biobank-1' },
              quality_standard: { id: 'iso-15189', label: 'ISO 15189:2012' },
              assess_level_bio: { id: 'eric', label: 'BBMRI-ERIC audited' }
            },
            {
              biobank: { id: 'biobank-1' },
              quality_standard: { id: 'iso-17043-2010', label: 'ISO 17043:2010' },
              assess_level_bio: { id: 'accredited', label: 'Certified by accredited body' }
            },
            {
              biobank: { id: 'biobank-2' },
              quality_standard: { id: 'iso-17043-2010', label: 'ISO 17043:2010' },
              assess_level_bio: { id: 'eric', label: 'BBMRI-ERIC audited' }
            }
          ]
        }
        api.get.mockResolvedValueOnce(response)
        state.filters.selections.biobank_quality = ['accredited', 'eric']
        const commit = jest.fn()

        await actions.GetBiobankIdsForQuality({ state, commit })
        expect(commit.mock.calls[0]).toEqual(['SetBiobankIdsWithSelectedQuality', response])
      })

      it('should get biobank quality from route', async () => {
        const response = {
          items: [
            {
              biobank: { id: 'biobank-1' },
              quality_standard: { id: 'iso-15189', label: 'ISO 15189:2012' },
              assess_level_bio: { id: 'eric', label: 'BBMRI-ERIC audited' }
            },
            {
              biobank: { id: 'biobank-1' },
              quality_standard: { id: 'iso-17043-2010', label: 'ISO 17043:2010' },
              assess_level_bio: { id: 'accredited', label: 'Certified by accredited body' }
            },
            {
              biobank: { id: 'biobank-2' },
              quality_standard: { id: 'iso-17043-2010', label: 'ISO 17043:2010' },
              assess_level_bio: { id: 'eric', label: 'BBMRI-ERIC audited' }
            }
          ]
        }
        api.get.mockResolvedValueOnce(response)
        state.route.query.biobank_quality = ['accredited', 'eric']
        const commit = jest.fn()

        await actions.GetBiobankIdsForQuality({ state, commit })
        expect(commit.mock.calls[0]).toEqual(['SetBiobankIdsWithSelectedQuality', response])
      })

      it('should exit with an empty list', async () => {
        const commit = jest.fn()

        await actions.GetBiobankIdsForQuality({ state, commit })
        expect(commit.mock.calls[0]).toEqual(['SetBiobankIdsWithSelectedQuality', []])
      })
    })

    describe('GetCollectionIdsForQuality', () => {
      let state
      beforeEach(() => {
        state = mockState()
      })
      it('should retrieve collections ids from the server based on biobank quality filters and true SatisfyAll', async () => {
        const response = {
          items: [
            {
              collection: { id: 'col-1' },
              quality_standard: { id: 'iso-15189', label: 'ISO 15189:2012' },
              assess_level_col: { id: 'eric', label: 'BBMRI-ERIC audited' }
            },
            {
              collection: { id: 'col-1' },
              quality_standard: { id: 'iso-17043-2010', label: 'ISO 17043:2010' },
              assess_level_col: { id: 'accredited', label: 'Certified by accredited body' }
            }
          ]
        }
        api.get.mockResolvedValueOnce(response)
        state.filters.selections.collection_quality = ['accredited', 'eric']
        state.filters.satisfyAll = ['collection_quality']
        const commit = jest.fn()

        await actions.GetCollectionIdsForQuality({ state, commit })
        expect(commit.mock.calls[0]).toEqual(['SetCollectionIdsWithSelectedQuality', response])
      })

      it('should retrieve biobank ids from the server based on biobank quality filters and false SatisfyAll', async () => {
        const response = {
          items: [
            {
              collection: { id: 'col-1' },
              quality_standard: { id: 'iso-15189', label: 'ISO 15189:2012' },
              assess_level_col: { id: 'eric', label: 'BBMRI-ERIC audited' }
            },
            {
              collection: { id: 'col-1' },
              quality_standard: { id: 'iso-17043-2010', label: 'ISO 17043:2010' },
              assess_level_col: { id: 'accredited', label: 'Certified by accredited body' }
            },
            {
              collection: { id: 'col-2' },
              quality_standard: { id: 'iso-17043-2010', label: 'ISO 17043:2010' },
              assess_level_col: { id: 'eric', label: 'BBMRI-ERIC audited' }
            }
          ]
        }
        api.get.mockResolvedValueOnce(response)
        state.filters.selections.collection_quality = ['accredited', 'eric']
        const commit = jest.fn()

        await actions.GetCollectionIdsForQuality({ state, commit })
        expect(commit.mock.calls[0]).toEqual(['SetCollectionIdsWithSelectedQuality', response])
      })
      it('should get collection quality from route', async () => {
        const response = {
          items: [
            {
              collection: { id: 'col-1' },
              quality_standard: { id: 'iso-15189', label: 'ISO 15189:2012' },
              assess_level_col: { id: 'eric', label: 'BBMRI-ERIC audited' }
            },
            {
              collection: { id: 'col-1' },
              quality_standard: { id: 'iso-17043-2010', label: 'ISO 17043:2010' },
              assess_level_col: { id: 'accredited', label: 'Certified by accredited body' }
            },
            {
              collection: { id: 'col-2' },
              quality_standard: { id: 'iso-17043-2010', label: 'ISO 17043:2010' },
              assess_level_col: { id: 'eric', label: 'BBMRI-ERIC audited' }
            }
          ]
        }
        api.get.mockResolvedValueOnce(response)
        state.route.query.collection_quality = ['accredited', 'eric']
        const commit = jest.fn()

        await actions.GetCollectionIdsForQuality({ state, commit })
        expect(commit.mock.calls[0]).toEqual(['SetCollectionIdsWithSelectedQuality', response])
      })

      it('should exit with an empty list', async () => {
        const commit = jest.fn()

        await actions.GetCollectionIdsForQuality({ state, commit })
        expect(commit.mock.calls[0]).toEqual(['SetCollectionIdsWithSelectedQuality', []])
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
        const commit = jest.fn()

        await actions.GetCollectionInfo({ commit, getters })
        expect(commit.mock.calls[0]).toEqual(['SetCollectionInfo', undefined])
        expect(commit.mock.calls[1]).toEqual(['SetCollectionInfo', response])
        expect(commit.mock.calls[2]).toEqual(['SetDictionaries', response])
      })
    })

    describe('GetBiobankReport', () => {
      it('should retrieve a single biobank entity from the server based on a biobank id and store it in the state', done => {
        const biobank = {
          _meta: {
            name: 'biobank'
          },
          id: 'biobank-1'
        }

        api.get.mockResolvedValueOnce(biobank)

        const options = {
          payload: 'biobank-1',
          expectedMutations: [
            { type: 'SetLoading', payload: true },
            { type: 'SetBiobankReport', payload: biobank },
            { type: 'SetLoading', payload: false }
          ]
        }

        utils.testAction(actions.GetBiobankReport, options, done)
      })

      it('should return biobank from state if it is already there', done => {
        const state = {
          allBiobanks: [
            { id: 'biobank' }
          ]
        }

        const options = {
          state,
          payload: 'biobank',
          expectedMutations: [
            { type: 'SetBiobankReport', payload: { id: 'biobank' } }
          ]
        }

        utils.testAction(actions.GetBiobankReport, options, done)
      })
    })
    describe('GetCollectionReport', () => {
      it('should retrieve a single collection entity from the server based on a collection id and store it in the state', done => {
        const response = {
          _meta: {
            name: 'meta'
          },
          id: '001',
          name: 'beautiful collection',
          description: 'beautiful samples'
        }

        api.get.mockResolvedValueOnce(response)

        const options = {
          payload: '001',
          expectedMutations: [
            { type: 'SetLoading', payload: true },
            { type: 'SetCollectionReport', payload: response },
            { type: 'SetLoading', payload: false }
          ]
        }
        utils.testAction(actions.GetCollectionReport, options, done)
      })
    })

    describe('GetNetworkReport', () => {
      const neverReturningPromise = new Promise(() => {})
      const collectionError = new Error('No way!')
      it('should set error', done => {
        api.get.mockResolvedValueOnce(neverReturningPromise)
        api.get.mockResolvedValueOnce(neverReturningPromise)
        api.get.mockRejectedValueOnce(collectionError)

        const options = {
          payload: '001',
          expectedMutations: [
            { type: 'SetNetworkBiobanks', payload: undefined },
            { type: 'SetNetworkCollections', payload: undefined },
            { type: 'SetNetworkReport', payload: undefined },
            { type: 'SetLoading', payload: true },
            { type: 'SetError', payload: collectionError }
          ]
        }
        utils.testAction(actions.GetNetworkReport, options, done)
      })

      it('should load network', done => {
        const network = {
          _meta: {
            name: 'meta'
          },
          id: '001',
          name: 'beautiful network',
          description: 'beautiful data'
        }
        api.get.mockResolvedValueOnce(network)
        api.get.mockResolvedValueOnce(neverReturningPromise)
        api.get.mockResolvedValueOnce(neverReturningPromise)

        const options = {
          payload: '001',
          expectedMutations: [
            { type: 'SetNetworkBiobanks', payload: undefined },
            { type: 'SetNetworkCollections', payload: undefined },
            { type: 'SetNetworkReport', payload: undefined },
            { type: 'SetLoading', payload: true },
            { type: 'SetNetworkReport', payload: network },
            { type: 'SetLoading', payload: false }
          ]
        }
        utils.testAction(actions.GetNetworkReport, options, done)
      })

      it('should retrieve the collections and biobanks of a network from the server based on a network id and store them in the state', done => {
        const networkPromise = new Promise(() => {})
        api.get.mockResolvedValueOnce(networkPromise)
        api.get.mockResolvedValueOnce([{ id: 'bb-1' }])
        api.get.mockResolvedValueOnce([{ id: 'col-1' }])

        const options = {
          payload: '001',
          expectedMutations: [
            { type: 'SetNetworkBiobanks', payload: undefined },
            { type: 'SetNetworkCollections', payload: undefined },
            { type: 'SetNetworkReport', payload: undefined },
            { type: 'SetLoading', payload: true },
            { type: 'SetNetworkCollections', payload: [{ id: 'col-1' }] },
            { type: 'SetNetworkBiobanks', payload: [{ id: 'bb-1' }] }
          ]
        }
        utils.testAction(actions.GetNetworkReport, options, done)
      })
    })
  })

  describe('AddCollectionsToSelection', () => {
    const commit = jest.fn()
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
})
