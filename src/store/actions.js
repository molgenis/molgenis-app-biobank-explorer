import api from '@molgenis/molgenis-api-client'
import { getFilteredCollections, getHumanReadableString } from './utils/negotiator.query'
import utils from '../utils'
import {
  MAP_DIAGNOSIS_AVAILABLE_QUERY_TO_STATE,
  SET_BIOBANKS,
  SET_COUNTRIES,
  SET_DIAGNOSIS_AVAILABLE,
  SET_ERROR,
  SET_LOADING,
  SET_MATERIALS,
  SET_SEARCH,
  SET_STANDARDS
} from './mutations'

/* ACTION CONSTANTS */
export const GET_COUNTRIES = '__GET_COUNTRIES__'
export const GET_MATERIALS = '__GET_MATERIALS__'
export const GET_STANDARDS = '__GET_STANDARDS__'
export const GET_DIAGNOSIS_AVAILABLE = '__GET_DIAGNOSIS_AVAILABLE__'
export const QUERY_DIAGNOSIS_AVAILABLE = '__QUERY_DIAGNOSIS_AVAILABLE__'
export const GET_BIOBANKS_AND_COLLECTIONS = '__GET_BIOBANKS_AND_COLLECTIONS__'
export const GET_BIOBANKS_BY_ID = '__GET_BIOBANKS_BY_ID__'
export const GET_BIOBANK_IDENTIFIERS = '__GET_BIOBANK_IDENTIFIERS__'
export const SEND_TO_NEGOTIATOR = '__SEND_TO_NEGOTIATOR__'

/* API PATHS */
const BIOBANK_API_PATH = '/api/v2/eu_bbmri_eric_biobanks'
const COLLECTION_API_PATH = 'api/v2/eu_bbmri_eric_collections'
const STANDARDS_API_PATH = 'api/v2/eu_bbmri_eric_lab_standards'
const COUNTRY_API_PATH = '/api/v2/eu_bbmri_eric_countries'
const MATERIALS_API_PATH = '/api/v2/eu_bbmri_eric_material_types'
const DISEASE_API_PATH = '/api/v2/eu_bbmri_eric_disease_types'

const COLLECTION_ATTRIBUTE_SELECTOR = 'collections(id,materials,standards,diagnosis_available,name,type,order_of_magnitude)'

/**
 * Return an Array of unique biobank identifiers
 *
 * @param biobanks
 * @returns {Array}
 */
const getUniqueBiobanksIds = (biobanks) => {
  return Array.from(new Set(biobanks.map(biobank => biobank.biobank.id)))
}

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
    api.get(`${DISEASE_API_PATH}?num=10&q=code=in=(${diagnosisAvailableIds})`).then(response => {
      commit(MAP_DIAGNOSIS_AVAILABLE_QUERY_TO_STATE, response.items)
    }, error => {
      commit(SET_ERROR, error)
    })
  },
  /**
   * Retrieve 100 biobanks with expanded collections
   * Filters the initial list of biobanks immediately if a search is included
   *
   * Do not show all because:
   * 1) It severely slows down the app
   * 2) Users can not scroll through them anyway
   * 3) The server is called again on filter change, always presenting the most relevant biobanks
   *
   */
  [GET_BIOBANKS_AND_COLLECTIONS] ({commit}, search) {
    commit(SET_LOADING, true)

    let uri = `${BIOBANK_API_PATH}?num=100&attrs=${COLLECTION_ATTRIBUTE_SELECTOR},*`
    if (search) {
      commit(SET_SEARCH, search)
      uri += `&q=*=q=${search}`
    }

    api.get(uri).then(response => {
      commit(SET_BIOBANKS, response.items)
      commit(SET_LOADING, false)
    }, error => {
      commit(SET_ERROR, error)
    })
  },
  /**
   * Retrieve biobanks with expanded collections based on a list of biobank ids
   *
   * @param commit
   * @param biobanks
   */
  [GET_BIOBANKS_BY_ID] ({commit}, biobanks) {
    if (biobanks.length > 0) {
      const biobankIds = getUniqueBiobanksIds(biobanks)
      const uri = `${BIOBANK_API_PATH}?num=100&attrs=${COLLECTION_ATTRIBUTE_SELECTOR},*&q=id=in=(${biobankIds.join(',')})`

      api.get(uri).then(response => {
        commit(SET_BIOBANKS, response.items)
        commit(SET_LOADING, false)
      }, error => {
        commit(SET_ERROR, error)
      })
    }
  },
  /**
   * Retrieve biobank identifiers for filters on collection.country, collection.standards, collection.materials,
   * or collection.diagnosis_available.code
   *
   * @example queries
   * q=country.id==NL,country.id==BE
   * q=materials.id==RNA,materials.id==DNA
   * q=diagnosis_available.code==C18,diagnosis_available.code==L40
   * q=standards.id==cen-ts-16835-1-2015,standards.id==cen-ts-16827-1-2015
   *
   * TODO replace with =in=(...) queries once https://github.com/molgenis/molgenis/issues/6811 is fixed
   *
   * @param state
   * @param commit
   * @param dispatch
   * @param filter
   */
  [GET_BIOBANK_IDENTIFIERS] ({state, commit, dispatch}) {
    commit(SET_LOADING, true)

    const queryParts = []
    queryParts.push(utils.filterToQueryPart('country.id', state.country.filters))
    queryParts.push(utils.filterToQueryPart('materials.id', state.materials.filters))
    queryParts.push(utils.filterToQueryPart('standards.id', state.standards.filters))
    queryParts.push(utils.filterToQueryPart('diagnosis_available.code', state.diagnosis_available.filters.map(filter => filter.code)))

    const query = utils.queryPartsToQuery(queryParts).length > 0 ? '&q=' + utils.queryPartsToQuery(queryParts) : ''
    api.get(`${COLLECTION_API_PATH}?num=10000&attrs=biobank${query}`).then(response => {
      dispatch(GET_BIOBANKS_BY_ID, response.items)
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
    const collections = getFilteredCollections(state)
    const humanReadable = getHumanReadableString(state)

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
