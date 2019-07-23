import api from '@molgenis/molgenis-api-client'
import helpers from './helpers'
import utils from '../utils'
import 'array-flat-polyfill'
import {
  SET_ALL_BIOBANKS,
  SET_COLLECTION_IDS,
  SET_BIOBANK_REPORT,
  SET_COLLECTION_TYPES,
  SET_COUNTRIES,
  SET_DATA_TYPES,
  SET_DIAGNOSIS_AVAILABLE,
  SET_ERROR,
  SET_MATERIALS,
  SET_COLLECTION_QUALITY,
  SET_BIOBANK_QUALITY,
  MAP_QUERY_TO_STATE,
  SET_COLLECTION_QUALITY_COLLECTIONS,
  SET_BIOBANK_QUALITY_BIOBANKS
} from './mutations'
import { encodeRsqlValue } from '@molgenis/rsql'

/* ACTION CONSTANTS */
export const GET_COUNTRY_OPTIONS = '__GET_COUNTRY_OPTIONS__'
export const GET_MATERIALS_OPTIONS = '__GET_MATERIALS_OPTIONS__'
export const GET_COLLECTION_QUALITY_OPTIONS = '__GET_COLLECTION_QUALITY_OPTIONS__'
export const GET_BIOBANK_QUALITY_OPTIONS = '__GET_BIOBANK_QUALITY_OPTIONS__'
export const GET_TYPES_OPTIONS = '__GET_TYPES_OPTIONS__'
export const GET_DATA_TYPE_OPTIONS = '__GET_DATA_TYPE_OPTIONS__'
export const QUERY_DIAGNOSIS_AVAILABLE_OPTIONS = '__QUERY_DIAGNOSIS_AVAILABLE_OPTIONS__'
export const GET_COLLECTION_QUALITY_COLLECTIONS = '__GET_COLLECTION_QUALITY_COLLECTIONS__'
export const GET_BIOBANK_QUALITY_BIOBANKS = '__GET_BIOBANK_QUALITY_BIOBANKS__'
export const GET_ALL_BIOBANKS = '__GET_ALL_BIOBANKS__'
export const GET_COLLECTION_IDENTIFIERS = '__GET_COLLECTION_IDENTIFIERS__'
export const GET_QUERY = '__GET_QUERY__'
export const GET_BIOBANK_REPORT = '__GET_BIOBANK_REPORT__'
export const SEND_TO_NEGOTIATOR = '__SEND_TO_NEGOTIATOR__'

/* API PATHS */
const BIOBANK_API_PATH = '/api/v2/eu_bbmri_eric_biobanks'
const COLLECTION_API_PATH = '/api/v2/eu_bbmri_eric_collections'
const COLLECTION_QUALITY_API_PATH = '/api/v2/eu_bbmri_eric_assess_level_col'
const BIOBANK_QUALITY_API_PATH = '/api/v2/eu_bbmri_eric_assess_level_bio'
const COUNTRY_API_PATH = '/api/v2/eu_bbmri_eric_countries'
const MATERIALS_API_PATH = '/api/v2/eu_bbmri_eric_material_types'
const COLLECTION_TYPES_API_PATH = '/api/v2/eu_bbmri_eric_collection_types'
const DATA_TYPES_API_PATH = '/api/v2/eu_bbmri_eric_data_types'
const DISEASE_API_PATH = '/api/v2/eu_bbmri_eric_disease_types'
const COLLECTION_QUALITY_INFO_API_PATH = '/api/v2/eu_bbmri_eric_col_qual_info'
const BIOBANK_QUALITY_INFO_API_PATH = '/api/v2/eu_bbmri_eric_bio_qual_info'

const COLLECTION_ATTRIBUTE_SELECTOR = 'collections(id,materials,diagnosis_available,name,type,order_of_magnitude(*),size,sub_collections(*),parent_collection,quality(*))'

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
  /**
   * Retrieve biobanks with expanded collections based on a list of biobank ids
   *
   * @param commit
   * @param biobanks
   */
  [GET_ALL_BIOBANKS] ({commit, dispatch}) {
    api.get(`${BIOBANK_API_PATH}?num=10000&attrs=${COLLECTION_ATTRIBUTE_SELECTOR},*`)
      .then(response => {
        commit(SET_ALL_BIOBANKS, response.items)
        dispatch(GET_COLLECTION_IDENTIFIERS)
      }, error => {
        commit(SET_ERROR, error)
      })
  },
  /**
   * Retrieve biobank identifiers for rsql value
   */
  [GET_COLLECTION_IDENTIFIERS] ({state, commit, getters}) {
    if (!getters.rsql.length) {
      commit(SET_COLLECTION_IDS, state.allBiobanks.flatMap(biobank => biobank.collections.map(collection => collection.id)))
    } else {
      commit(SET_COLLECTION_IDS, undefined)
      api.get(`${COLLECTION_API_PATH}?num=10000&attrs=~id&q=${encodeRsqlValue(getters.rsql)}`)
        .then(response => {
          commit(SET_COLLECTION_IDS, response.items.map(item => item.id))
        }, error => {
          commit(SET_ERROR, error)
        })
    }
  },
  [GET_BIOBANK_REPORT] ({commit}, biobankId) {
    api.get(`${BIOBANK_API_PATH}?attrs=${COLLECTION_ATTRIBUTE_SELECTOR},${utils.qualityAttributeSelector('bio')},contact(*),*&q=id==${biobankId}`).then(response => {
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
  [SEND_TO_NEGOTIATOR] ({state, getters, commit}) {
    const options = {
      body: JSON.stringify(helpers.createNegotiatorQueryBody(state, getters, helpers.getLocationHref()))
    }
    api.post('/plugin/directory/export', options)
      .then(helpers.setLocationHref, error => commit(SET_ERROR, error))
  }
}
