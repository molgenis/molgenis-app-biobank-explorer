import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import td from 'testdouble'
import api from '@molgenis/molgenis-api-client'
import utils from '@molgenis/molgenis-vue-test-utils'
import helpers from '../../../../src/store/helpers'
import { mockState } from '../mockState'
import actions, { COLLECTION_ATTRIBUTE_SELECTOR, COLLECTION_REPORT_ATTRIBUTE_SELECTOR } from '../../../../src/store/actions'
import filterDefinitions from '../../../../src//utils/filterDefinitions'

chai.use(sinonChai)

jest.mock('@molgenis/molgenis-api-client', () => {
  return {
    post: jest.fn(),
    get: jest.fn()
  }
})

describe('store', () => {
  describe('actions', () => {
    afterEach(() => td.reset())

    describe('GetBiobanks', () => {
      it('should retrieve biobanks from the server and store them in state', (done) => {
        const response = {
          items: [
            { id: '1', name: 'biobank-1' },
            { id: '2', name: 'biobank-2' },
            { id: '3', name: 'biobank-3' }
          ]
        }

        const get = td.function('api.get')
        td.when(get(`/api/v2/eu_bbmri_eric_biobanks?num=10000&attrs=${COLLECTION_ATTRIBUTE_SELECTOR},*&q=id=in=(id1,id2)`)).thenResolve(response)
        td.replace(api, 'get', get)

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
        state.route = { query: {} }
        getters = {
          rsql: 'materials=in=(CELL_LINES);name=q="Cell&Co"',
          filterDefinitions: filterDefinitions(state),
          getActiveFilters: state.filters.selections,
          biobanks: [
            { id: 'biobank1', collections: [{ id: 'collection1' }, { id: 'collection2' }] },
            { id: 'biobank2', collections: [{ id: 'collection3' }, { id: 'collection4' }] }
          ]
        }
        helpers.setLocationHref = jest.fn()
        api.get.mockResolvedValueOnce({ items: [] })
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
      it('should retrieve biobank ids from the server based on biobank filters', done => {
        const response = {
          items: [
            { data: { id: 'biobank-1' } },
            { data: { id: 'biobank-2' } }
          ]
        }

        const get = td.function('api.get')
        td.when(get('/api/data/eu_bbmri_eric_biobanks?filter=id&size=10000&sort=name&q=covid19=in=(covid19)'))
          .thenResolve(response)
        td.replace(api, 'get', get)

        const getters = { biobankRsql: 'covid19=in=(covid19)' }
        const commit = sinon.spy()

        actions.GetBiobankIds({ commit, getters })

        setTimeout(function () {
          sinon.assert.calledWithMatch(commit.secondCall, 'SetBiobankIds', ['biobank-1', 'biobank-2'])
          done()
        }, 300)
      })
    })

    describe('GetCollectionInfo', () => {
      const response = {
        items: [
          { data: { id: 'c1', biobank: { links: { self: 'https://directory.bbmri-eric.eu/api/data/eu_bbmri_eric_biobanks/b1' } } } },
          { data: { id: 'c2', biobank: { links: { self: 'https://directory.bbmri-eric.eu/api/data/eu_bbmri_eric_biobanks/b2' } } } }
        ]
      }

      it('should retrieve collection and biobank ids from the server based on collection filters', async () => {
        api.get.mockResolvedValueOnce(response)
        const getters = { rsql: 'country=in=(NL,BE)' }
        const commit = jest.fn()

        await actions.GetCollectionInfo({ commit, getters })
        expect(commit.mock.calls[0]).toEqual(['SetCollectionInfo', undefined])
        expect(commit.mock.calls[1]).toEqual(
          ['SetCollectionInfo',
            [{ biobankId: 'b1', collectionId: 'c1', collectionName: undefined },
              { biobankId: 'b2', collectionId: 'c2', collectionName: undefined }]
          ])
        expect(commit.mock.calls[2]).toEqual(['MapQueryToState'])
      })

      it('should retrieve all collection and biobank ids if there is no collection filter', async () => {
        api.get.mockResolvedValueOnce(response)
        const getters = { rsql: '' }
        const commit = jest.fn()

        await actions.GetCollectionInfo({ commit, getters })
        expect(commit.mock.calls[0]).toEqual(['SetCollectionInfo', undefined])
        expect(commit.mock.calls[1]).toEqual(
          ['SetCollectionInfo',
            [{ biobankId: 'b1', collectionId: 'c1', collectionName: undefined },
              { biobankId: 'b2', collectionId: 'c2', collectionName: undefined }]
          ])
        expect(commit.mock.calls[2]).toEqual(['MapQueryToState'])
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

        const get = td.function('api.get')
        td.when(get(`/api/v2/eu_bbmri_eric_biobanks/biobank-1?attrs=${COLLECTION_ATTRIBUTE_SELECTOR},quality(id,standards(*),assess_level_bio(*),certification_number,certification_image_link,certification_report,label),contact(*),*`)).thenResolve(biobank)
        td.replace(api, 'get', get)

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

        const get = td.function('api.get')

        td.when(get(`/api/v2/eu_bbmri_eric_collections/001?attrs=${COLLECTION_REPORT_ATTRIBUTE_SELECTOR}`)).thenResolve(response)
        td.replace(api, 'get', get)

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
      const collectionCall = `/api/v2/eu_bbmri_eric_collections?q=network==001&num=10000&attrs=${COLLECTION_REPORT_ATTRIBUTE_SELECTOR}`
      it('should set error', done => {
        const collectionError = new Error('No way!')
        const get = td.function('api.get')
        td.when(get('/api/v2/eu_bbmri_eric_networks/001')).thenReturn(neverReturningPromise)
        td.when(get('/api/v2/eu_bbmri_eric_biobanks?q=network==001&num=10000')).thenReturn(neverReturningPromise)
        td.when(get(collectionCall)).thenReject(collectionError)
        td.replace(api, 'get', get)
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
        const get = td.function('api.get')
        td.when(get('/api/v2/eu_bbmri_eric_networks/001')).thenResolve(network)

        td.when(get('/api/v2/eu_bbmri_eric_biobanks?q=network==001&num=10000')).thenReturn(neverReturningPromise)
        td.when(get(collectionCall)).thenReturn(neverReturningPromise)
        td.replace(api, 'get', get)
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
        const get = td.function('api.get')
        const networkPromise = new Promise(() => {})
        td.when(get('/api/v2/eu_bbmri_eric_networks/001')).thenReturn(networkPromise)
        td.when(get('/api/v2/eu_bbmri_eric_biobanks?q=network==001&num=10000')).thenResolve([{ id: 'bb-1' }])
        td.when(get(collectionCall)).thenResolve([{ id: 'col-1' }])
        td.replace(api, 'get', get)
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
})
