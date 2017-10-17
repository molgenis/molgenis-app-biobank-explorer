import api from '@molgenis/molgenis-api-client'
import { getFilteredCollections, getHumanReadableString } from './utils/negotiator.query'
import { SET_BIOBANKS, SET_COUNTRIES, SET_ERROR, SET_LOADING, SET_MATERIAL_TYPES, SET_QUALITY, SET_DISEASE_TYPES } from './mutations'

export const GET_BIOBANKS_AND_COLLECTIONS = '__GET_BIOBANKS_AND_COLLECTIONS__'
export const GET_COUNTRIES = '__GET_COUNTRIES__'
export const GET_MATERIAL_TYPES = '__GET_MATERIAL_TYPES__'
export const GET_QUALITY = '__GET_QUALITY__'
export const SEND_TO_NEGOTIATOR = '__SEND_TO_NEGOTIATOR__'
export const QUERY_DISEASE_TYPES = '__QUERY_DISEASE_TYPES__'

export default {
  [GET_BIOBANKS_AND_COLLECTIONS] ({commit, state}) {
    let uri = '/api/v2/eu_bbmri_eric_biobanks?attrs=collections(*),*&num=2000'
    if (state.search !== '') uri += '&q=*=q="' + state.search + '"'

    commit(SET_LOADING, true)
    api.get(uri, {}).then(response => {
      commit(SET_BIOBANKS, response)
      commit(SET_LOADING, false)
    }, error => {
      commit(SET_ERROR, error)
    })
  },
  [GET_COUNTRIES] ({commit}) {
    /**
     * Pass options to the fetch like body, method, x-molgenis-token etc...
     * @type {{}}
     */
    const options = {}
    api.get('/api/v2/eu_bbmri_eric_countries', options).then(response => {
      // FIXME: get complete response and show label attribute in checkbox
      commit(SET_COUNTRIES, response.items)
    }, error => {
      commit(SET_ERROR, error)
    })
  },
  [GET_MATERIAL_TYPES] ({commit}) {
    /**
     * Pass options to the fetch like body, method, x-molgenis-token etc...
     * @type {{}}
     */
    const options = {}
    api.get('/api/v2/eu_bbmri_eric_material_types', options).then(response => {
      commit(SET_MATERIAL_TYPES, response.items)
    }, error => {
      commit(SET_ERROR, error)
    })
  },
  [GET_QUALITY] ({commit}) {
    /**
     * Pass options to the fetch like body, method, x-molgenis-token etc...
     * @type {{}}
     */
    const options = {}
    api.get('/api/v2/eu_bbmri_eric_lab_standards', options).then(response => {
      commit(SET_QUALITY, response.items)
    }, error => {
      commit(SET_ERROR, error)
    })
  },
  [QUERY_DISEASE_TYPES] ({commit}, query) {
    const options = {}
    api.get('/api/v2/eu_bbmri_eric_disease_types?num=20&q=label=q=' + query, options).then(response => {
      commit(SET_DISEASE_TYPES, response.items)
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
