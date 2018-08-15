import td from 'testdouble'
import api from '@molgenis/molgenis-api-client'
import actions, { GET_BIOBANK_IDENTIFIERS, GET_DATA_TYPE_OPTIONS, GET_TYPES_OPTIONS } from '../../../../src/store/actions'
import helpers from '../../../../src/store/helpers'
import utils from '@molgenis/molgenis-vue-test-utils'
import {
  MAP_QUERY_TO_STATE,
  SET_BIOBANK_REPORT,
  SET_BIOBANKS, SET_COLLECTION_TYPES,
  SET_COUNTRIES, SET_DATA_TYPES,
  SET_DIAGNOSIS_AVAILABLE,
  SET_LOADING,
  SET_MATERIALS,
  SET_STANDARDS
} from '../../../../src/store/mutations'

describe('store', () => {
  describe('actions', () => {
    afterEach(() => td.reset())

    describe('GET_COUNTRIES', () => {
      it('should retrieve list of available countries from the server and store them in the state', done => {
        const response = {
          items: [
            {id: 'NL', label: 'Netherlands'},
            {id: 'BE', label: 'Belgium'}
          ]
        }

        const get = td.function('api.get')
        td.when(get('/api/v2/eu_bbmri_eric_countries')).thenResolve(response)
        td.replace(api, 'get', get)

        const options = {
          expectedMutations: [
            {type: SET_COUNTRIES, payload: response.items}
          ]
        }

        utils.testAction(actions.__GET_COUNTRY_OPTIONS__, options, done)
      })
    })

    describe('GET_TYPES_OPTIONS', () => {
      it('should retrieve list of available collection types from the server and store them in the state', done => {
        const response = {
          items: [
            {
              _href: '/api/v2/eu_bbmri_eric_collection_types/BIRTH_COHORT',
              description: 'A cohort study for which the subjects are followed from the time of birth usually including information about gestation and follow up.',
              id: 'BIRTH_COHORT',
              label: 'Birth cohort'
            },
            {
              _href: '/api/v2/eu_bbmri_eric_collection_types/CASE_CONTROL',
              description: 'A case-control study design compares two groups of subjects: those with the disease or condition under study (cases) and a very similar group of subjects who do not have the disease or condition (controls).',
              id: 'CASE_CONTROL',
              label: 'Case-Control'
            }
          ]
        }

        const get = td.function('api.get')
        td.when(get('/api/v2/eu_bbmri_eric_collection_types')).thenResolve(response)
        td.replace(api, 'get', get)

        const options = {
          expectedMutations: [
            {type: SET_COLLECTION_TYPES, payload: response.items}
          ]
        }

        utils.testAction(actions[GET_TYPES_OPTIONS], options, done)
      })
    })

    describe('GET_DATA_TYPES_OPTIONS', () => {
      it('should retrieve list of available collection types from the server and store them in the state', done => {
        const response = {
          items: [
            {
              _href: '/api/v2/eu_bbmri_eric_data_types/BIOLOGICAL_SAMPLES',
              description: 'Y/N if biological samples are collected from the participants in the sample collection/study',
              id: 'BIOLOGICAL_SAMPLES',
              label: 'Biological samples'
            },
            {
              _href: '/api/v2/eu_bbmri_eric_data_types/GENEALOGICAL_RECORDS',
              description: 'Y/N if genealogical records are associated with the participants in the sample collection/study',
              id: 'GENEALOGICAL_RECORDS',
              label: 'Genealogical records',
              ontology: 'Miabis'
            }
          ]
        }

        const get = td.function('api.get')
        td.when(get('/api/v2/eu_bbmri_eric_data_types')).thenResolve(response)
        td.replace(api, 'get', get)

        const options = {
          expectedMutations: [
            {type: SET_DATA_TYPES, payload: response.items}
          ]
        }

        utils.testAction(actions[GET_DATA_TYPE_OPTIONS], options, done)
      })
    })

    describe('GET_MATERIALS', () => {
      it('should retrieve list of available material types from the server and store them in the state', done => {
        const response = {
          items: [
            {id: 'RNA', label: 'RNA'},
            {id: 'PLASMA', label: 'Plasma'}
          ]
        }

        const get = td.function('api.get')
        td.when(get('/api/v2/eu_bbmri_eric_material_types')).thenResolve(response)
        td.replace(api, 'get', get)

        const options = {
          expectedMutations: [
            {type: SET_MATERIALS, payload: response.items}
          ]
        }

        utils.testAction(actions.__GET_MATERIALS_OPTIONS__, options, done)
      })
    })

    describe('GET_STANDARDS', () => {
      it('should retrieve list of available standards from the server and store them in the state', done => {
        const response = {
          items: [
            {id: 'a-smart_standard', label: 'A cool standard'},
            {id: 'a-smart_standard', label: 'A smart standard'}
          ]
        }

        const get = td.function('api.get')
        td.when(get('/api/v2/eu_bbmri_eric_lab_standards')).thenResolve(response)
        td.replace(api, 'get', get)

        const options = {
          expectedMutations: [
            {type: SET_STANDARDS, payload: response.items}
          ]
        }

        utils.testAction(actions.__GET_STANDARDS_OPTIONS__, options, done)
      })
    })

    describe('QUERY_DIAGNOSIS_AVAILABLE_OPTIONS', () => {
      it('should store an empty list in the state when query is empty', done => {
        const options = {
          payload: '',
          expectedMutations: [
            {type: SET_DIAGNOSIS_AVAILABLE, payload: []}
          ]
        }

        utils.testAction(actions.__QUERY_DIAGNOSIS_AVAILABLE_OPTIONS__, options, done)
      })

      it('should retrieve a list of disease types based on a search query from the server and store them in the state', done => {
        const response = {
          items: [
            {id: 'search'}
          ]
        }

        const get = td.function('api.get')
        td.when(get('/api/v2/eu_bbmri_eric_disease_types?q=label=q=search,id=q=search,code=q=search')).thenResolve(response)
        td.replace(api, 'get', get)

        const options = {
          payload: 'search',
          expectedMutations: [
            {type: SET_DIAGNOSIS_AVAILABLE, payload: response.items}
          ]
        }

        utils.testAction(actions.__QUERY_DIAGNOSIS_AVAILABLE_OPTIONS__, options, done)
      })
    })

    describe('MAP_QUERY_TO_STATE', () => {
      it('should commit MAP_QUERY_TO_STATE mutation when no diagnosis ids are in the URL', done => {
        const state = {
          route: {
            query: {
              country: 'NL,BE'
            }
          }
        }

        const options = {
          state: state,
          expectedMutations: [
            {type: MAP_QUERY_TO_STATE}
          ]
        }

        utils.testAction(actions.__MAP_QUERY_TO_STATE__, options, done)
      })

      it('should fetch biobanks when no query is present', done => {
        const state = {
          route: {
            query: {}
          }
        }

        const options = {
          state: state,
          expectedActions: [
            {type: GET_BIOBANK_IDENTIFIERS}
          ]
        }

        utils.testAction(actions.__MAP_QUERY_TO_STATE__, options, done)
      })

      it('should fetch diagnoses from the server and map result + URL query to state', done => {
        const state = {
          route: {
            query: {
              diagnosis_available: 'C18,L40'
            }
          }
        }

        const response = {
          items: [
            {code: 'C18'},
            {code: 'L40'}
          ]
        }

        const get = td.function('api.get')
        td.when(get('/api/v2/eu_bbmri_eric_disease_types?q=code=in=(C18,L40)')).thenResolve(response)
        td.replace(api, 'get', get)

        const options = {
          state: state,
          expectedMutations: [
            {type: MAP_QUERY_TO_STATE, payload: response.items}
          ]
        }

        utils.testAction(actions.__MAP_QUERY_TO_STATE__, options, done)
      })
    })

    describe('GET_BIOBANKS_BY_ID', () => {
      it('should store an empty list in the state when the list of biobanks is empty', done => {
        const options = {
          payload: [],
          expectedMutations: [
            {type: SET_BIOBANKS, payload: []},
            {type: SET_LOADING, payload: false}
          ]
        }

        utils.testAction(actions.__GET_BIOBANKS_BY_ID__, options, done)
      })

      it('should retrieve a list of biobanks based on a unique set of biobank ids from the server and store them in state', done => {
        const response = {
          items: [
            {id: '1', name: 'biobank-1'},
            {id: '2', name: 'biobank-2'},
            {id: '3', name: 'biobank-3'}
          ]
        }

        const get = td.function('api.get')
        td.when(get('/api/v2/eu_bbmri_eric_biobanks?num=101&attrs=collections(id,materials,standards,diagnosis_available,name,type,order_of_magnitude(*),size,sub_collections(*),parent_collection),*&q=id=in=(1,2,3)')).thenResolve(response)
        td.replace(api, 'get', get)

        const options = {
          payload: [
            {biobank: {id: '1'}},
            {biobank: {id: '1'}},
            {biobank: {id: '2'}},
            {biobank: {id: '3'}},
            {biobank: {id: '3'}}
          ],
          expectedMutations: [
            {type: SET_BIOBANKS, payload: response.items},
            {type: SET_LOADING, payload: false}
          ]
        }

        utils.testAction(actions.__GET_BIOBANKS_BY_ID__, options, done)
      })
    })

    describe('GET_BIOBANK_IDENTIFIERS', () => {
      it('should retrieve biobank ids from the server based on a set of filters and dispatch another action', done => {
        const response = {
          items: [
            {biobank: {id: 'biobank-1'}},
            {biobank: {id: 'biobank-2'}}
          ]
        }

        const createRSQLQuery = td.function('helpers.createRSQLQuery')
        td.when(createRSQLQuery(td.matchers.anything())).thenReturn('&q=id=q=biobank-1')
        td.replace(helpers, 'createRSQLQuery', createRSQLQuery)

        const get = td.function('api.get')
        td.when(get('/api/v2/eu_bbmri_eric_collections?num=10000&attrs=~id,biobank&q=id=q=biobank-1')).thenResolve(response)
        td.replace(api, 'get', get)

        const options = {
          expectedMutations: [
            {type: SET_LOADING, payload: true}
          ],
          expectedActions: [
            {type: '__GET_BIOBANKS_BY_ID__', payload: response.items}
          ]
        }

        utils.testAction(actions.__GET_BIOBANK_IDENTIFIERS__, options, done)
      })
    })

    describe('GET_BIOBANK_REPORT', () => {
      it('should retrieve a single biobank entity from the server based on a biobank id and store it in the state', done => {
        const response = {
          meta: {
            name: 'meta'
          },
          items: [
            {id: 'biobank-1'},
            {id: 'biobank-2'}
          ]
        }

        const get = td.function('api.get')
        td.when(get('/api/v2/eu_bbmri_eric_biobanks?attrs=collections(id,materials,standards,diagnosis_available,name,type,order_of_magnitude(*),size,sub_collections(*),parent_collection),contact(*),*&q=id==biobank-1')).thenResolve(response)
        td.replace(api, 'get', get)

        const options = {
          payload: 'biobank-1',
          expectedMutations: [
            {type: SET_BIOBANK_REPORT, payload: response}
          ]
        }

        utils.testAction(actions.__GET_BIOBANK_REPORT__, options, done)
      })
    })
  })
})
