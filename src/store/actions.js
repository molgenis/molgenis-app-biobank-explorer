import api from '@molgenis/molgenis-api-client'
import { getFilteredCollections, getHumanReadableString } from './utils/negotiator.query'
import {
  SET_BIOBANKS,
  SET_COUNTRIES,
  SET_DIAGNOSIS_AVAILABLE,
  SET_ERROR,
  SET_LOADING,
  SET_MATERIALS,
  SET_SEARCH,
  SET_STANDARDS
} from './mutations'

export const GET_COUNTRIES = '__GET_COUNTRIES__'
export const GET_MATERIALS = '__GET_MATERIALS__'
export const GET_STANDARDS = '__GET_STANDARDS__'
export const QUERY_DIAGNOSIS_AVAILABLE = '__QUERY_DIAGNOSIS_AVAILABLE__'
export const GET_BIOBANKS_AND_COLLECTIONS = '__GET_BIOBANKS_AND_COLLECTIONS__'
export const GET_BIOBANKS_BY_ID = '__GET_BIOBANKS_BY_ID__'
export const GET_BIOBANK_IDENTIFIERS = '__GET_BIOBANK_IDENTIFIERS__'
export const SEND_TO_NEGOTIATOR = '__SEND_TO_NEGOTIATOR__'

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
  [GET_COUNTRIES] ({commit}) {
    api.get('/api/v2/eu_bbmri_eric_countries').then(response => {
      commit(SET_COUNTRIES, response.items)
    }, error => {
      commit(SET_ERROR, error)
    })
  },
  [GET_MATERIALS] ({commit}) {
    api.get('/api/v2/eu_bbmri_eric_material_types').then(response => {
      commit(SET_MATERIALS, response.items)
    }, error => {
      commit(SET_ERROR, error)
    })
  },
  [GET_STANDARDS] ({commit}) {
    api.get('/api/v2/eu_bbmri_eric_lab_standards').then(response => {
      commit(SET_STANDARDS, response.items)
    }, error => {
      commit(SET_ERROR, error)
    })
  },
  [QUERY_DIAGNOSIS_AVAILABLE] ({commit}, query) {
    if (query) {
      api.get('/api/v2/eu_bbmri_eric_disease_types?num=20&q=label=q=' + query + ',id=q=' + query).then(response => {
        commit(SET_DIAGNOSIS_AVAILABLE, response.items)
      }, error => {
        commit(SET_ERROR, error)
      })
    } else {
      commit(SET_DIAGNOSIS_AVAILABLE, [])
    }
  },
  /**
   * Retrieve all biobanks with expanded collections
   * Filters the initial list of biobanks immediately if a search is included
   */
  [GET_BIOBANKS_AND_COLLECTIONS] ({commit}, search) {
    commit(SET_LOADING, true)

    let uri = '/api/v2/eu_bbmri_eric_biobanks?num=2000&attrs=collections(materials,standards,diagnosis_available,name,type,order_of_magnitude),*'
    if (search) {
      commit(SET_SEARCH, search)
      uri += '&q=*=q=' + search
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
    const biobankIds = getUniqueBiobanksIds(biobanks)
    const uri = '/api/v2/eu_bbmri_eric_biobanks?num=2000&attrs=collections(materials,standards,diagnosis_available,name,type,order_of_magnitude),*&num=2000&q=id=in=(' + biobankIds.join(',') + ')'

    api.get(uri).then(response => {
      commit(SET_BIOBANKS, response)
      commit(SET_LOADING, false)
    }, error => {
      commit(SET_ERROR, error)
    })
  },
  /**
   * Retrieve biobank identifiers for filters on collection.standards, collection.materials,
   * or collection.diagnosis_available.code
   *
   * @example queries
   * q=materials.id==RNA,materials.id==DNA
   * q=diagnosis_available.code==C18,diagnosis_available.code==L40
   * q=standards.id==cen-ts-16835-1-2015,standards.id==cen-ts-16827-1-2015
   *
   * @param state
   * @param commit
   * @param dispatch
   * @param filter
   */
  [GET_BIOBANK_IDENTIFIERS] ({commit, dispatch}, {options, filter}) {
    commit(SET_LOADING, true)

    api.get('/api/v2/eu_bbmri_eric_collections?num=2000&attrs=biobank&q=' + options.map(option => filter + '==' + option).join(',')).then(response => {
      dispatch(GET_BIOBANKS_BY_ID, response.items)
    }, error => {
      commit(SET_ERROR, error)
    })
  },
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
