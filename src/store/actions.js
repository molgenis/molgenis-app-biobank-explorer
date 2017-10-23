import api from '@molgenis/molgenis-api-client'
import helpers from './helpers'
import utils from '../utils'
import {
  MAP_DIAGNOSIS_AVAILABLE_QUERY_TO_STATE,
  SET_BIOBANK_REPORT,
  SET_BIOBANKS,
  SET_COUNTRIES,
  SET_DIAGNOSIS_AVAILABLE,
  SET_ERROR,
  SET_LOADING,
  SET_MATERIALS,
  SET_STANDARDS
} from './mutations'

/* ACTION CONSTANTS */
export const GET_COUNTRIES = '__GET_COUNTRIES__'
export const GET_MATERIALS = '__GET_MATERIALS__'
export const GET_STANDARDS = '__GET_STANDARDS__'
export const GET_DIAGNOSIS_AVAILABLE = '__GET_DIAGNOSIS_AVAILABLE__'
export const QUERY_DIAGNOSIS_AVAILABLE = '__QUERY_DIAGNOSIS_AVAILABLE__'
export const GET_BIOBANKS_BY_ID = '__GET_BIOBANKS_BY_ID__'
export const GET_BIOBANK_IDENTIFIERS = '__GET_BIOBANK_IDENTIFIERS__'
export const GET_BIOBANK_REPORT = '__GET_BIOBANK_REPORT__'
export const SEND_TO_NEGOTIATOR = '__SEND_TO_NEGOTIATOR__'

/* API PATHS */
const BIOBANK_API_PATH = '/api/v2/eu_bbmri_eric_biobanks'
const COLLECTION_API_PATH = '/api/v2/eu_bbmri_eric_collections'
const STANDARDS_API_PATH = '/api/v2/eu_bbmri_eric_lab_standards'
const COUNTRY_API_PATH = '/api/v2/eu_bbmri_eric_countries'
const MATERIALS_API_PATH = '/api/v2/eu_bbmri_eric_material_types'
const DISEASE_API_PATH = '/api/v2/eu_bbmri_eric_disease_types'

const COLLECTION_ATTRIBUTE_SELECTOR = 'collections(id,materials,standards,diagnosis_available,name,type,order_of_magnitude)'

export default {
  /**
   * Filter actions, used to retrieve country, standards, and materials data on the beforeCreate phase of the Vue component
   * diagnosis_available is queried asynchronously when an option is being searched for.
   */
  [GET_COUNTRIES] ({commit}) {
    api.get(COUNTRY_API_PATH).then(response => {
      commit(SET_COUNTRIES, response.items)
    }, error => {
      commit(SET_ERROR, error)
    })
  },
  [GET_MATERIALS] ({commit}) {
    api.get(MATERIALS_API_PATH).then(response => {
      commit(SET_MATERIALS, response.items)
    }, error => {
      commit(SET_ERROR, error)
    })
  },
  [GET_STANDARDS] ({commit}) {
    api.get(STANDARDS_API_PATH).then(response => {
      commit(SET_STANDARDS, response.items)
    }, error => {
      commit(SET_ERROR, error)
    })
  },
  [QUERY_DIAGNOSIS_AVAILABLE] ({commit}, query) {
    if (query) {
      api.get(`${DISEASE_API_PATH}?num=10&q=label=q=${query},id=q=${query}`).then(response => {
        commit(SET_DIAGNOSIS_AVAILABLE, response.items)
      }, error => {
        commit(SET_ERROR, error)
      })
    } else {
      commit(SET_DIAGNOSIS_AVAILABLE, [])
    }
  },
  /**
   * Fetches complete disease type objects if the route query parameters contains diagnosis_available IDs
   */
  [GET_DIAGNOSIS_AVAILABLE] ({commit}, diagnosisAvailableIds) {
    if (diagnosisAvailableIds) {
      api.get(`${DISEASE_API_PATH}?q=code=in=(${diagnosisAvailableIds})`).then(response => {
        commit(MAP_DIAGNOSIS_AVAILABLE_QUERY_TO_STATE, response.items)
      }, error => {
        commit(SET_ERROR, error)
      })
    }
  },
  /**
   * Retrieve biobanks with expanded collections based on a list of biobank ids
   *
   * @param commit
   * @param biobanks
   */
  [GET_BIOBANKS_BY_ID] ({commit}, biobanks) {
    if (biobanks.length > 0) {
      const uniqueBiobankIds = utils.getUniqueIdArray(biobanks.map(biobank => biobank.biobank.id))
      const uri = `${BIOBANK_API_PATH}?num=2000&attrs=${COLLECTION_ATTRIBUTE_SELECTOR},*&q=id=in=(${uniqueBiobankIds.join(',')})`

      api.get(uri).then(response => {
        commit(SET_BIOBANKS, response.items)
        commit(SET_LOADING, false)
      }, error => {
        commit(SET_ERROR, error)
        commit(SET_LOADING, false)
      })
    } else {
      commit(SET_BIOBANKS, [])
      commit(SET_LOADING, false)
    }
  },
  /**
   * Retrieve biobank identifiers for filters on collection.country, collection.standards, collection.materials,
   * or collection.diagnosis_available
   */
  [GET_BIOBANK_IDENTIFIERS] ({state, commit, dispatch}) {
    commit(SET_LOADING, true)

    const query = helpers.createQuery(state)

    api.get(`${COLLECTION_API_PATH}?num=10000&attrs=biobank${query}`).then(response => {
      dispatch(GET_BIOBANKS_BY_ID, response.items)
    }, error => {
      commit(SET_ERROR, error)
      commit(SET_LOADING, false)
    })
  },
  [GET_BIOBANK_REPORT] ({commit}, biobankId) {
    api.get(`${BIOBANK_API_PATH}?attrs=${COLLECTION_ATTRIBUTE_SELECTOR},*&q=id==${biobankId}`).then(response => {
      commit(SET_BIOBANK_REPORT, response.items[0])
    }, error => {
      commit(SET_ERROR, error)
    })
  },
  /**
   * Transform the state into a NegotiatorQuery object.
   * Calls the DirectoryController method '/export' which answers with a URL
   * that redirects to a Negotiator server specified in the Directory settings
   */
  [SEND_TO_NEGOTIATOR] ({state}) {
    // Remove the nToken from the URL to prevent duplication on the negotiator side
    // when a query is edited more than once
    const url = window.location.href.replace(/&nToken=\w{32}/, '')
    const collections = helpers.getFilteredCollections(state.biobanks)
    const humanReadable = helpers.getHumanReadableString(state)

    const negotiatorQuery = {
      URL: url,
      collections: collections,
      humanReadable: humanReadable,
      nToken: state.nToken
    }

    const options = {
      body: JSON.stringify(negotiatorQuery)
    }

    api.post('/plugin/directory/export', options).then(response => {
      window.location.href = response
    }, error => {
      console.log(error)
    })
  }
}
