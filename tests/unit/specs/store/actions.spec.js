import chai, { expect } from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import td from 'testdouble'
import api from '@molgenis/molgenis-api-client'
import utils from '@molgenis/molgenis-vue-test-utils'
import helpers from '../../../../src/store/helpers'
import { mockState } from '../mockState'
import actions, { COLLECTION_REPORT_ATTRIBUTE_SELECTOR } from '../../../../src/store/actions'

chai.use(sinonChai)

describe('store', () => {
  describe('actions', () => {
    afterEach(() => td.reset())

    describe('GetCovid19Options', () => {
      it('should retrieve list of available covid19 options from the server and store them in the state', done => {
        const response = {
          items: [
            { id: 'covid19', label: 'Member of the COVID-19 network' }]
        }

        const get = td.function('api.get')
        td.when(get('/api/v2/eu_bbmri_eric_COVID_19')).thenResolve(response)
        td.replace(api, 'get', get)

        const options = {
          expectedMutations: [
            { type: 'SetCovid19', payload: response.items }
          ]
        }

        utils.testAction(actions.GetCovid19Options, options, done)
      })
    })

    describe('QUERY_DIAGNOSIS_AVAILABLE_OPTIONS', () => {
      it('should store an empty list in the state when query is empty', done => {
        const options = {
          payload: '',
          expectedMutations: [
            { type: 'SetDiagnosisAvailable', payload: [] }
          ]
        }

        utils.testAction(actions.QueryDiagnosisAvailableOptions, options, done)
      })

      it('should retrieve a list of disease types based on a search query from the server and store them in the state', done => {
        const response = {
          items: [{ label: 'search' }]
        }

        const get = td.function('api.get')
        td.when(get('/api/v2/eu_bbmri_eric_disease_types?q=label=q=search')).thenResolve(response)
        td.replace(api, 'get', get)

        const options = {
          payload: 'search',
          expectedMutations: [
            { type: 'SetDiagnosisAvailable', payload: response.items }
          ]
        }

        utils.testAction(actions.QueryDiagnosisAvailableOptions, options, done)
      })

      it('should retrieve a list of disease types based on a code query from the server and store them in the state', done => {
        const response = {
          items: [{ code: 'A01' }]
        }

        const get = td.function('api.get')
        td.when(get('/api/v2/eu_bbmri_eric_disease_types?q=code=like=A01&sort=code')).thenResolve(response)
        td.replace(api, 'get', get)

        const options = {
          payload: 'a01',
          expectedMutations: [
            { type: 'SetDiagnosisAvailable', payload: response.items }
          ]
        }

        utils.testAction(actions.QueryDiagnosisAvailableOptions, options, done)
      })
    })

    describe('GET_QUERY', () => {
      it('should commit GET_QUERY mutation when no diagnosis ids are in the URL', done => {
        const response = { items: [{ code: 'L40' }] }
        const get = td.function('api.get')

        td.when(get('/api/v2/eu_bbmri_eric_disease_types?q=code=in=(C18,L40)')).thenResolve(response)
        td.replace(api, 'get', get)

        // rewrite tis to use mockState
        const state = {
          route: {
            query: {
              country: 'NL,BE',
              diagnosis_available: 'C18,L40'
            }
          }
        }

        const commit = sinon.spy()
        const dispatch = sinon.spy()

        actions.GetQuery({ state, dispatch, commit })

        setTimeout(function () {
          sinon.assert.calledWithMatch(commit, 'MapQueryToState', { diagnoses: [{ code: 'L40' }] })
          done()
        }, 300)
      })

      it('should fetch diagnoses from the server and map result + URL query to state', () => {
        const state = {
          route: {
            query: {
              diagnosis_available: 'C18,L40'
            }
          }
        }

        const response = {
          items: [
            { code: 'L40' }
          ]
        }

        const get = td.function('api.get')
        td.when(get('/api/v2/eu_bbmri_eric_disease_types?q=code=in=(C18,L40)')).thenResolve(response)
        td.replace(api, 'get', get)

        const commit = sinon.spy()
        const dispatch = sinon.spy()

        actions.GetQuery({ state, dispatch, commit })
        expect(commit).to.have.been.calledWith('MapQueryToState')
      })

      it('should trigger the action to get the collections matching the applied quality standards and map result + URL query to state', () => {
        const state = {
          route: {
            query: {
              collection_quality: 'eric,self'
            }
          }
        }

        const commit = sinon.spy()
        const dispatch = sinon.spy()

        actions.GetQuery({ state, dispatch, commit })
        expect(dispatch).to.have.been.calledWith('GetCollectionQualityCollections')
        expect(commit).to.have.been.calledWith('MapQueryToState')
      })
    })

    describe('GET_BIOBANKS', () => {
      it('should retrieve biobanks from the server and store them in state', (done) => {
        const response = {
          items: [
            { id: '1', name: 'biobank-1' },
            { id: '2', name: 'biobank-2' },
            { id: '3', name: 'biobank-3' }
          ]
        }

        const get = td.function('api.get')
        td.when(get('/api/v2/eu_bbmri_eric_biobanks?num=10000&attrs=collections(id,description,materials,diagnosis_available,name,type,order_of_magnitude(*),size,sub_collections(*),parent_collection,quality(*),data_categories),*&q=id=in=(id1,id2)')).thenResolve(response)
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
      const state = mockState()

      state.negotiatorCollectionEntityId = 'eu_bbmri_eric_collections'
      state.search = 'Cell&Co'
      state.materials.filters = ['CELL_LINES']

      const getters = {
        rsql: 'materials=in=(CELL_LINES);name=q="Cell&Co"',
        biobanks: [
          { id: 'biobank1', collections: [{ id: 'collection1' }, { id: 'collection2' }] },
          { id: 'biobank2', collections: [{ id: 'collection3' }, { id: 'collection4' }] }
        ]
      }
      const location = 'https://www.example.org/biobankexplorer?search=Cell%26Co&materials=CELL_LINES'

      it('should send a negotiator query to the server and then surf to the negotiator', (done) => {
        const post = td.function('api.post')
        const getLocationHref = td.function('getLocationHref')
        const setLocationHref = td.function('setLocationHref')
        td.replace(api, 'post', post)
        td.replace(helpers, 'setLocationHref', setLocationHref)
        td.replace(helpers, 'getLocationHref', getLocationHref)

        td.when(getLocationHref()).thenReturn(location)

        const bodyCaptor = td.matchers.captor()
        const negotiatorResponse = Promise.resolve('http://example.org/negotiator')
        td.when(post('/plugin/directory/export', bodyCaptor.capture())).thenReturn(negotiatorResponse)

        utils.testAction(actions.SendToNegotiator, { state, getters }, (arg) => {
          if (arg) {
            // testAction found an error
            done(arg)
          } else {
            negotiatorResponse.then(() => {
              expect(JSON.parse(bodyCaptor.value.body)).to.deep.eq({
                URL: location,
                entityId: 'eu_bbmri_eric_collections',
                rsql: 'materials=in=(CELL_LINES);name=q="Cell&Co"',
                nToken: null,
                humanReadable: 'Free text search contains Cell&Co and selected material types are CELL_LINES'
              })
              td.verify(setLocationHref('http://example.org/negotiator'))
            }).then(done).catch(done)
          }
        })
      })

      it('should commit the error if the server response was bad', (done) => {
        const post = td.function('api.post')
        const getLocationHref = td.function('getLocationHref')
        td.replace(api, 'post', post)
        td.replace(helpers, 'getLocationHref', getLocationHref)

        td.when(getLocationHref()).thenReturn(location)

        const error = { errors: [{ message: 'Negotiator not configured' }] }
        td.when(post('/plugin/directory/export', td.matchers.anything())).thenReject(error)

        utils.testAction(actions.SendToNegotiator, {
          state,
          getters,
          expectedMutations: [{ type: 'SetError', payload: error }]
        }, done)
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

      it('should retrieve collection and biobank ids from the server based on collection filters', done => {
        const get = td.function('api.get')
        td.when(get('/api/data/eu_bbmri_eric_collections?filter=id,biobank,name,label&size=10000&sort=biobank_label&q=country=in=(NL,BE)'))
          .thenResolve(response)
        td.replace(api, 'get', get)

        const getters = { rsql: 'country=in=(NL,BE)' }
        const commit = sinon.spy()
        const dispatch = sinon.spy()

        actions.GetCollectionInfo({ commit, dispatch, getters })

        setTimeout(function () {
          sinon.assert.calledWithMatch(commit.secondCall, 'SetCollectionInfo', [{ biobankId: 'b1', collectionId: 'c1', collectionName: undefined },
            { biobankId: 'b2', collectionId: 'c2', collectionName: undefined }])

          sinon.assert.calledWith(dispatch, 'GetQuery')
          done()
        }, 300)
      })

      it('should retrieve all collection and biobank ids if there is no collection filter', done => {
        const get = td.function('api.get')
        td.when(get('/api/data/eu_bbmri_eric_collections?filter=id,biobank,name,label&size=10000&sort=biobank_label'))
          .thenResolve(response)
        td.replace(api, 'get', get)

        const getters = { rsql: '' }
        const commit = sinon.spy()
        const dispatch = sinon.spy()

        actions.GetCollectionInfo({ commit, dispatch, getters })

        setTimeout(function () {
          sinon.assert.calledWithMatch(commit.secondCall, 'SetCollectionInfo', [{ biobankId: 'b1', collectionId: 'c1', collectionName: undefined },
            { biobankId: 'b2', collectionId: 'c2', collectionName: undefined }])
          sinon.assert.calledWith(dispatch, 'GetQuery')
          done()
        }, 300)
      })
    })

    describe('GetCollectionQualityCollections', () => {
      it('should retrieve the collections for which certain level of assessment is applied for the quality standards', done => {
        const response = {
          meta: {
            name: 'meta'
          },
          items: [
            { id: 'random-1', collection: 'col-1', quality_standard: '1', asses_level_col: 'eric' },
            { id: 'random-2', collection: 'col-1', quality_standard: '2', asses_level_col: 'self' },
            { id: 'random-3', collection: 'col-2', quality_standard: '2', asses_level_col: 'eric' }
          ]
        }

        const state = {
          route: {
            query: {
              collection_quality: 'eric,self'
            }
          }
        }

        const get = td.function('api.get')
        td.when(get('/api/v2/eu_bbmri_eric_col_qual_info?q=assess_level_col=in=(eric,self)')).thenResolve(response)
        td.replace(api, 'get', get)
        const options = {
          state: state,
          expectedMutations: [
            { type: 'SetCollectionQualityCollections', payload: response.items }
          ]
        }

        utils.testAction(actions.GetCollectionQualityCollections, options, done)
      })

      it('should pass empty array to mutation when no quality standards are selected', done => {
        const state = {
          route: {
            query: {}
          }
        }

        const options = {
          state: state,
          expectedMutations: [
            { type: 'SetCollectionQualityCollections', payload: [] }
          ]
        }

        utils.testAction(actions.GetCollectionQualityCollections, options, done)
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
        td.when(get('/api/v2/eu_bbmri_eric_biobanks/biobank-1?attrs=collections(id,description,materials,diagnosis_available,name,type,order_of_magnitude(*),size,sub_collections(*),parent_collection,quality(*),data_categories),quality(id,standards(*),assess_level_bio(*),certification_number,certification_image_link,certification_report,label),contact(*),*')).thenResolve(biobank)
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

    describe('GetBiobankQualityBiobanks', () => {
      it('should retrieve the biobanks for which certain level of assessment is applied for the quality standards', done => {
        const response = {
          meta: {
            name: 'meta'
          },
          items: [
            { id: 'random-1', biobank: 'col-1', quality_standard: '1', asses_level_bio: 'eric' }
          ]
        }

        const state = {
          route: {
            query: {
              biobank_quality: 'eric'
            }
          }
        }

        const get = td.function('api.get')
        td.when(get('/api/v2/eu_bbmri_eric_bio_qual_info?q=assess_level_bio=in=(eric)')).thenResolve(response)
        td.replace(api, 'get', get)
        const options = {
          state: state,
          expectedMutations: [
            { type: 'SetBiobankQualityBiobanks', payload: response.items }
          ]
        }

        utils.testAction(actions.GetBiobankQualityBiobanks, options, done)
      })

      it('should pass empty array to mutation when no quality standards are selected', (done) => {
        const state = {
          route: {
            query: {}
          }
        }

        const options = {
          state: state,
          expectedMutations: [
            { type: 'SetBiobankQualityBiobanks', payload: [] }
          ]
        }

        utils.testAction(actions.GetBiobankQualityBiobanks, options, done)
      })
    })
  })
})
