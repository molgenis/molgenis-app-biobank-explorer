import api from '@molgenis/molgenis-api-client'
import helpers from './helpers'
import utils from '../utils'
import 'array-flat-polyfill'

import {
  SET_BIOBANKS,
  SET_COLLECTION_IDS,
  SET_BIOBANK_REPORT,
  SET_COLLECTION_REPORT,
  SET_NETWORK_REPORT,
  SET_COLLECTION_TYPES,
  SET_COUNTRIES,
  SET_DATA_TYPES,
  SET_DIAGNOSIS_AVAILABLE,
  SET_ERROR,
  SET_LOADING,
  SET_MATERIALS,
  SET_COLLECTION_QUALITY,
  SET_BIOBANK_QUALITY,
  MAP_QUERY_TO_STATE,
  SET_COLLECTION_QUALITY_COLLECTIONS,
  SET_BIOBANK_QUALITY_BIOBANKS,
  SET_NETWORK_COLLECTIONS,
  SET_NETWORK_BIOBANKS,
  SET_COVID_19,
  SET_NETWORK_OPTIONS,
  SET_BIOBANK_IDS
} from './mutations'
import { encodeRsqlValue, transformToRSQL } from '@molgenis/rsql'

/* ACTION CONSTANTS */
export const GET_COUNTRY_OPTIONS = '__GET_COUNTRY_OPTIONS__'
export const GET_MATERIALS_OPTIONS = '__GET_MATERIALS_OPTIONS__'
export const GET_COLLECTION_QUALITY_OPTIONS = '__GET_COLLECTION_QUALITY_OPTIONS__'
export const GET_BIOBANK_QUALITY_OPTIONS = '__GET_BIOBANK_QUALITY_OPTIONS__'
export const GET_TYPES_OPTIONS = '__GET_TYPES_OPTIONS__'
export const GET_DATA_TYPE_OPTIONS = '__GET_DATA_TYPE_OPTIONS__'
export const GET_COVID_19_OPTIONS = '__GET_COVID_19_OPTIONS__'
export const QUERY_DIAGNOSIS_AVAILABLE_OPTIONS = '__QUERY_DIAGNOSIS_AVAILABLE_OPTIONS__'
export const GET_COLLECTION_QUALITY_COLLECTIONS = '__GET_COLLECTION_QUALITY_COLLECTIONS__'
export const GET_BIOBANK_QUALITY_BIOBANKS = '__GET_BIOBANK_QUALITY_BIOBANKS__'
export const GET_BIOBANKS = '__GET_BIOBANKS__'
export const GET_COLLECTION_IDS = '__GET_COLLECTION_IDS__'
export const GET_BIOBANK_IDS = '__GET_BIOBANK_IDS__'
export const GET_QUERY = '__GET_QUERY__'
export const GET_BIOBANK_REPORT = '__GET_BIOBANK_REPORT__'
export const GET_COLLECTION_REPORT = '__GET_COLLECTION_REPORT__'
export const GET_NETWORK_REPORT = '__GET_NETWORK_REPORT__'
export const SEND_TO_NEGOTIATOR = '__SEND_TO_NEGOTIATOR__'
export const GET_NETWORK_OPTIONS = '__GET_BIOBANK_NETWORK_OPTIONS__'

/* API PATHS */
const BIOBANK_API_PATH = '/api/v2/eu_bbmri_eric_biobanks'
const COLLECTION_API_PATH = '/api/v2/eu_bbmri_eric_collections'
const NETWORK_API_PATH = '/api/v2/eu_bbmri_eric_networks'
const COLLECTION_QUALITY_API_PATH = '/api/v2/eu_bbmri_eric_assess_level_col'
const BIOBANK_QUALITY_API_PATH = '/api/v2/eu_bbmri_eric_assess_level_bio'
const COUNTRY_API_PATH = '/api/v2/eu_bbmri_eric_countries'
const MATERIALS_API_PATH = '/api/v2/eu_bbmri_eric_material_types'
const COLLECTION_TYPES_API_PATH = '/api/v2/eu_bbmri_eric_collection_types'
const DATA_TYPES_API_PATH = '/api/v2/eu_bbmri_eric_data_types'
const DISEASE_API_PATH = '/api/v2/eu_bbmri_eric_disease_types'
const COLLECTION_QUALITY_INFO_API_PATH = '/api/v2/eu_bbmri_eric_col_qual_info'
const BIOBANK_QUALITY_INFO_API_PATH = '/api/v2/eu_bbmri_eric_bio_qual_info'
const COVID_19_API_PATH = '/api/v2/eu_bbmri_eric_COVID_19'
/**/

/* Query Parameters */
const COLLECTION_ATTRIBUTE_SELECTOR = 'collections(id,description,materials,diagnosis_available,name,type,order_of_magnitude(*),size,sub_collections(*),parent_collection,quality(*),data_categories)'
const COLLECTION_REPORT_ATTRIBUTE_SELECTOR = '*,diagnosis_available(label),biobank(id,name,juridical_person,country,url,contact),contact(email,phone),sub_collections(name,id,sub_collections(*),parent_collection,order_of_magnitude,materials,data_categories)'
/**/

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
  [GET_COLLECTION_QUALITY_OPTIONS] ({commit}) {
    api.get(COLLECTION_QUALITY_API_PATH).then(response => {
      commit(SET_COLLECTION_QUALITY, response.items)
    }, error => {
      commit(SET_ERROR, error)
    })
  },
  [GET_BIOBANK_QUALITY_OPTIONS] ({commit}) {
    api.get(BIOBANK_QUALITY_API_PATH).then(response => {
      commit(SET_BIOBANK_QUALITY, response.items)
    }, error => {
      commit(SET_ERROR, error)
    })
  },
  [GET_COVID_19_OPTIONS] ({commit}) {
    api.get(COVID_19_API_PATH).then(response => {
      commit(SET_COVID_19, response.items)
    }, error => {
      commit(SET_ERROR, error)
    })
  },
  [GET_NETWORK_OPTIONS] ({commit}) {
    api.get(NETWORK_API_PATH).then(response => {
      commit(SET_NETWORK_OPTIONS, response.items)
    }, error => {
      commit(SET_ERROR, error)
    })
  },
  [QUERY_DIAGNOSIS_AVAILABLE_OPTIONS] ({commit}, query) {
    if (query) {
      const isCodeQuery = helpers.CODE_REGEX.test(query)
      const url = isCodeQuery
        ? `${DISEASE_API_PATH}?q=${encodeRsqlValue(helpers.createDiagnosisCodeQuery(query))}&sort=code`
        : `${DISEASE_API_PATH}?q=${encodeRsqlValue(helpers.createDiagnosisLabelQuery(query))}`

      api.get(url).then(response => {
        commit(SET_DIAGNOSIS_AVAILABLE, response.items)
      }, error => {
        commit(SET_ERROR, error)
      })
    } else {
      commit(SET_DIAGNOSIS_AVAILABLE, [])
    }
  },
  [GET_COLLECTION_QUALITY_COLLECTIONS] ({state, commit}) {
    if (state.route.query.collection_quality) {
      const collectionQualityIds = state.route.query.collection_quality.split(',')
      api.get(`${COLLECTION_QUALITY_INFO_API_PATH}?q=assess_level_col=in=(${collectionQualityIds})`).then(response => {
        commit(SET_COLLECTION_QUALITY_COLLECTIONS, response.items)
      })
    } else {
      commit(SET_COLLECTION_QUALITY_COLLECTIONS, [])
    }
  },

  [GET_BIOBANK_QUALITY_BIOBANKS] ({state, commit}) {
    if (state.route.query.biobank_quality) {
      const biobankQualityIds = state.route.query.biobank_quality.split(',')
      api.get(`${BIOBANK_QUALITY_INFO_API_PATH}?q=assess_level_bio=in=(${biobankQualityIds})`).then(response => {
        commit(SET_BIOBANK_QUALITY_BIOBANKS, response.items)
      })
    } else {
      commit(SET_BIOBANK_QUALITY_BIOBANKS, [])
    }
  },

  [GET_QUERY] ({state, dispatch, commit}) {
    if (Object.keys(state.route.query).length > 0) {
      if (state.route.query.diagnosis_available) {
        const diseaseTypeIds = state.route.query.diagnosis_available.split(',')

        api.get(`${DISEASE_API_PATH}?q=code=in=(${diseaseTypeIds})`).then(response => {
          commit(MAP_QUERY_TO_STATE, {diagnoses: response.items})
        })
      } else {
        commit(MAP_QUERY_TO_STATE)
      }
      if (state.route.query.collection_quality) {
        dispatch(GET_COLLECTION_QUALITY_COLLECTIONS)
        commit(MAP_QUERY_TO_STATE)
      } else {
        commit(MAP_QUERY_TO_STATE)
      }
    }
  },
  /*
   * Retrieves biobanks and stores them in the cache
   */
  [GET_BIOBANKS] ({commit}, biobankIds) {
    const q = encodeRsqlValue(transformToRSQL({selector: 'id', comparison: '=in=', arguments: biobankIds}))
    api.get(`${BIOBANK_API_PATH}?num=10000&attrs=${COLLECTION_ATTRIBUTE_SELECTOR},*&q=${q}`)
      .then(response => {
        commit(SET_BIOBANKS, response.items)
      }, error => {
        commit(SET_ERROR, error)
      })
  },
  /*
   * Retrieves all collection identifiers matching the collection filters, and their biobanks
   */
  [GET_COLLECTION_IDS] ({commit, dispatch, getters}) {
    commit(SET_COLLECTION_IDS, undefined)
    let url = '/api/data/eu_bbmri_eric_collections?filter=id,biobank&size=10000&sort=biobank_label'
    if (getters.rsql) {
      url = `${url}&q=${encodeRsqlValue(getters.rsql)}`
    }
    api.get(url)
      .then(response => {
        const collectionIds = response.items.map(item => ({
          collectionId: item.data.id,
          biobankId: helpers.getBiobankId(item.data.biobank.links.self)
        }))
        commit(SET_COLLECTION_IDS, collectionIds)
        dispatch(GET_QUERY)
      }, error => {
        commit(SET_ERROR, error)
      })
  },
  [GET_BIOBANK_IDS] ({commit, getters}) {
    commit(SET_BIOBANK_IDS, undefined)
    let url = '/api/data/eu_bbmri_eric_biobanks?filter=id&size=10000&sort=name'
    if (getters.biobankRsql) {
      url = `${url}&q=${encodeRsqlValue(getters.biobankRsql)}`
    }
    api.get(url)
      .then(response => {
        commit(SET_BIOBANK_IDS, response.items.map(item => item.data.id))
      }, error => {
        commit(SET_ERROR, error)
      })
  },
  [GET_BIOBANK_REPORT] ({commit, state}, biobankId) {
    if (state.allBiobanks) {
      commit(SET_BIOBANK_REPORT, state.allBiobanks.find(it => it.id === biobankId))
      return
    }
    commit(SET_LOADING, true)
    api.get(`${BIOBANK_API_PATH}/${biobankId}?attrs=${COLLECTION_ATTRIBUTE_SELECTOR},${utils.qualityAttributeSelector('bio')},contact(*),*`).then(response => {
      commit(SET_BIOBANK_REPORT, response)
      commit(SET_LOADING, false)
    }, error => {
      commit(SET_ERROR, error)
      commit(SET_LOADING, false)
    })
  },
  [GET_COLLECTION_REPORT] ({commit}, collectionId) {
    commit(SET_LOADING, true)
    api.get(`${COLLECTION_API_PATH}/${collectionId}?attrs=${COLLECTION_REPORT_ATTRIBUTE_SELECTOR}`).then(response => {
      commit(SET_COLLECTION_REPORT, response)
      commit(SET_LOADING, false)
    }, error => {
      commit(SET_ERROR, error)
      commit(SET_LOADING, false)
    })
  },
  [GET_NETWORK_REPORT] ({commit, dispatch, state}, networkId) {
    commit(SET_NETWORK_BIOBANKS, undefined)
    commit(SET_NETWORK_COLLECTIONS, undefined)
    commit(SET_NETWORK_REPORT, undefined)
    commit(SET_LOADING, true)
    const networks = api.get(`${NETWORK_API_PATH}/${networkId}`)
      .then(response => commit(SET_NETWORK_REPORT, response))
      .finally(() => commit(SET_LOADING, false))
    const collections = api.get(`${COLLECTION_API_PATH}?q=network==${networkId}&num=10000&attrs=${COLLECTION_REPORT_ATTRIBUTE_SELECTOR}`)
      .then(response => commit(SET_NETWORK_COLLECTIONS, response.items))
    const biobanks = api.get(`${BIOBANK_API_PATH}?q=network==${networkId}&num=10000`)
      .then(response => commit(SET_NETWORK_BIOBANKS, response.items))
    Promise.all([collections, biobanks, networks])
      .catch((error) => commit(SET_ERROR, error))
  },
  /**
   * Transform the state into a NegotiatorQuery object.
   * Calls the DirectoryController method '/export' which answers with a URL
   * that redirects to a Negotiator server specified in the Directory settings
   */
  [SEND_TO_NEGOTIATOR] ({state, getters, commit}) {
    const options = {
      body: JSON.stringify(helpers.createNegotiatorQueryBody(state, getters, helpers.getLocationHref()))
    }
    return api.post('/plugin/directory/export', options)
      .then(helpers.setLocationHref, error => commit(SET_ERROR, error))
  }
}
