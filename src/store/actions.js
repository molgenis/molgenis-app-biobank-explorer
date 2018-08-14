import api from '@molgenis/molgenis-api-client'
import helpers from './helpers'
import utils from '../utils'
import {
  SET_BIOBANK_REPORT,
  SET_BIOBANKS,
  SET_COLLECTION_TYPES,
  SET_COUNTRIES,
  SET_DATA_TYPES,
  SET_DIAGNOSIS_AVAILABLE,
  SET_ERROR,
  SET_LOADING,
  SET_MATERIALS,
  SET_STANDARDS
} from './mutations'

/* ACTION CONSTANTS */
export const GET_COUNTRY_OPTIONS = '__GET_COUNTRY_OPTIONS__'
export const GET_MATERIALS_OPTIONS = '__GET_MATERIALS_OPTIONS__'
export const GET_STANDARDS_OPTIONS = '__GET_STANDARDS_OPTIONS__'
export const GET_TYPES_OPTIONS = '__GET_TYPES_OPTIONS__'
export const GET_DATA_TYPE_OPTIONS = '__GET_DATA_TYPE_OPTIONS__'
export const QUERY_DIAGNOSIS_AVAILABLE_OPTIONS = '__QUERY_DIAGNOSIS_AVAILABLE_OPTIONS__'
export const GET_BIOBANKS_BY_ID = '__GET_BIOBANKS_BY_ID__'
export const GET_BIOBANK_IDENTIFIERS = '__GET_BIOBANK_IDENTIFIERS__'
export const MAP_QUERY_TO_STATE = '__MAP_QUERY_TO_STATE__'
export const GET_BIOBANK_REPORT = '__GET_BIOBANK_REPORT__'
export const SEND_TO_NEGOTIATOR = '__SEND_TO_NEGOTIATOR__'

/* API PATHS */
const BIOBANK_API_PATH = '/api/v2/eu_bbmri_eric_biobanks'
const COLLECTION_API_PATH = '/api/v2/eu_bbmri_eric_collections'
const STANDARDS_API_PATH = '/api/v2/eu_bbmri_eric_lab_standards'
const COUNTRY_API_PATH = '/api/v2/eu_bbmri_eric_countries'
const MATERIALS_API_PATH = '/api/v2/eu_bbmri_eric_material_types'
const COLLECTION_TYPES_API_PATH = '/api/v2/eu_bbmri_eric_collection_types'
const DATA_TYPES_API_PATH = '/api/v2/eu_bbmri_eric_data_types'
const DISEASE_API_PATH = '/api/v2/eu_bbmri_eric_disease_types'

const COLLECTION_ATTRIBUTE_SELECTOR = 'collections(id,materials,standards,diagnosis_available,name,type,order_of_magnitude(*),size,sub_collections(*),parent_collection)'

export default {
  /**
   * Filter actions, used to retrieve country, standards, and materials data on the beforeCreate phase of the Vue component
   * diagnosis_available is queried asynchronously when an option is being searched for.
   */
  [GET_DATA_TYPE_OPTIONS] ({commit}) {
    api.get(DATA_TYPES_API_PATH).then(response => {
      commit(SET_DATA_TYPES, response.items)
    }, error => {
      commit(SET_ERROR, error)
    })
  },
  [GET_TYPES_OPTIONS] ({commit}) {
    api.get(COLLECTION_TYPES_API_PATH).then(response => {
      commit(SET_COLLECTION_TYPES, response.items)
    }, error => {
      commit(SET_ERROR, error)
    })
  },
  [GET_COUNTRY_OPTIONS] ({commit}) {
    api.get(COUNTRY_API_PATH).then(response => {
      commit(SET_COUNTRIES, response.items)
    }, error => {
      commit(SET_ERROR, error)
    })
  },
  [GET_MATERIALS_OPTIONS] ({commit}) {
    api.get(MATERIALS_API_PATH).then(response => {
      commit(SET_MATERIALS, response.items)
    }, error => {
      commit(SET_ERROR, error)
    })
  },
  [GET_STANDARDS_OPTIONS] ({commit}) {
    api.get(STANDARDS_API_PATH).then(response => {
      commit(SET_STANDARDS, response.items)
    }, error => {
      commit(SET_ERROR, error)
    })
  },
  [QUERY_DIAGNOSIS_AVAILABLE_OPTIONS] ({commit}, query) {
    if (query) {
      api.get(`${DISEASE_API_PATH}?q=label=q=${query},id=q=${query},code=q=${query}`).then(response => {
        commit(SET_DIAGNOSIS_AVAILABLE, response.items)
      }, error => {
        commit(SET_ERROR, error)
      })
    } else {
      commit(SET_DIAGNOSIS_AVAILABLE, [])
    }
  },
  [MAP_QUERY_TO_STATE] ({state, dispatch, commit}) {
    if (Object.keys(state.route.query).length > 0) {
      if (state.route.query.diagnosis_available) {
        const diseaseTypeIds = state.route.query.diagnosis_available.split(',')

        api.get(`${DISEASE_API_PATH}?q=code=in=(${diseaseTypeIds})`).then(response => {
          commit(MAP_QUERY_TO_STATE, response.items)
        })
      } else {
        commit(MAP_QUERY_TO_STATE)
      }
    } else {
      dispatch(GET_BIOBANK_IDENTIFIERS)
    }
  },
  /**
   * Retrieve biobanks with expanded collections based on a list of biobank ids
   *
   * @param commit
   * @param biobanks
   */
  [GET_BIOBANKS_BY_ID] ({commit}, biobanks) {
    if (biobanks && biobanks.length > 0) {
      /* To prevent the =in= query from becoming huge, we slice the first 101 biobank identifiers from the list of unique IDs  */
      const uniqueBiobankIds = utils.getUniqueIdArray(biobanks.map(biobank => biobank.biobank.id)).slice(0, 101)
      const uri = `${BIOBANK_API_PATH}?num=101&attrs=${COLLECTION_ATTRIBUTE_SELECTOR},*&q=id=in=(${uniqueBiobankIds.join(',')})`

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

    const query = helpers.createRSQLQuery(state)

    api.get(`${COLLECTION_API_PATH}?num=10000&attrs=~id,biobank${query}`).then(response => {
      dispatch(GET_BIOBANKS_BY_ID, response.items)
    }, error => {
      commit(SET_ERROR, error)
      commit(SET_LOADING, false)
    })
  },
  [GET_BIOBANK_REPORT] ({commit}, biobankId) {
    api.get(`${BIOBANK_API_PATH}?attrs=${COLLECTION_ATTRIBUTE_SELECTOR},contact(*),*&q=id==${biobankId}`).then(response => {
      commit(SET_BIOBANK_REPORT, response)
    }, error => {
      commit(SET_ERROR, error)
    })
  },
  /**
   * Transform the state into a NegotiatorQuery object.
   * Calls the DirectoryController method '/export' which answers with a URL
   * that redirects to a Negotiator server specified in the Directory settings
   */
  [SEND_TO_NEGOTIATOR] ({state, commit}) {
    const options = {
      body: JSON.stringify(helpers.createNegotiatorQueryBody(state, window.location.href))
    }

    api.post('/plugin/directory/export', options).then(response => {
      window.location.href = response
    }, error => {
      commit(SET_ERROR, error)
    })
  }
}
