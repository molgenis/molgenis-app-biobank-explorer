
import api from '@molgenis/molgenis-api-client'
import helpers from './helpers'
import utils, { createQuery, createInQuery } from '../utils'
import initialCollectionColumns from '../config/initialCollectionColumns'
import 'array-flat-polyfill'
import { flatten } from 'lodash'

import { encodeRsqlValue, transformToRSQL } from '@molgenis/rsql'

/* API PATHS */
const BIOBANK_API_PATH = '/api/v2/eu_bbmri_eric_biobanks'
const COLLECTION_API_PATH = '/api/v2/eu_bbmri_eric_collections'
const BIOBANK_QUALITY_STANDARDS = '/api/v2/eu_bbmri_eric_ops_standards'
const COLLECTION_QUALITY_STANDARDS = '/api/v2/eu_bbmri_eric_lab_standards'

export const COLLECTION_QUALITY_INFO_API_PATH = '/api/v2/eu_bbmri_eric_col_qual_info'
export const BIOBANK_QUALITY_INFO_API_PATH = '/api/v2/eu_bbmri_eric_bio_qual_info'

const NETWORK_API_PATH = '/api/v2/eu_bbmri_eric_networks'
const NEGOTIATOR_API_PATH = '/api/v2/sys_negotiator_NegotiatorConfig'
const NEGOTIATOR_CONFIG_API_PATH = '/api/v2/sys_negotiator_NegotiatorEntityConfig?attrs=*,biobankId(refEntityType)'
/**/

/* Query Parameters */
export const COLLECTION_ATTRIBUTE_SELECTOR = 'collections(id,description,materials,diagnosis_available(label,uri,code),name,type,order_of_magnitude(*),size,sub_collections(name,id,sub_collections(*),parent_collection,order_of_magnitude,materials(label,uri),data_categories),parent_collection,quality(*),data_categories(label,uri))'

const COLLECTION_REPORT_ATTRIBUTE_SELECTOR = () => {
  const collectionRsql = initialCollectionColumns.filter(icc => icc.rsql).map(prop => prop.rsql)

  let rsqlStart = '*,'

  if (collectionRsql.length) {
    rsqlStart += collectionRsql.join(',')
  }

  return `${rsqlStart},biobank(id,name,juridical_person,country,url,contact),contact(title_before_name,first_name,last_name,title_after_name,email,phone),sub_collections(name,id,sub_collections(*),parent_collection,order_of_magnitude,materials(label,uri),data_categories)`
}
/**/

export default {
  GetNegotiatorEntities ({ commit }) {
    api.get(NEGOTIATOR_CONFIG_API_PATH).then(response => {
      commit('SetNegotiatorEntities', response)
    })
  },
  async GetQualityStandardInformation ({ commit }) {
    const biobankQualityInfo = api.get(`${BIOBANK_QUALITY_STANDARDS}?num=10000&attrs=label,description`)
    const collectionQualityInfo = api.get(`${COLLECTION_QUALITY_STANDARDS}?num=10000&attrs=label,description`)
    const response = await Promise.all([biobankQualityInfo, collectionQualityInfo])

    commit('SetQualityStandardDictionary', response)
  },
  /*
   * Retrieves biobanks and stores them in the cache
   */
  GetBiobanks ({ commit }, biobankIds) {
    const q = encodeRsqlValue(transformToRSQL({ selector: 'id', comparison: '=in=', arguments: biobankIds }))
    api.get(`${BIOBANK_API_PATH}?num=10000&attrs=${COLLECTION_ATTRIBUTE_SELECTOR},*&q=${q}`)
      .then(response => {
        commit('SetBiobanks', response.items)
      }, error => {
        commit('SetError', error)
      })
  },
  // We need to get id's to use in RSQL later, because we can't do a join on this table
  GetCollectionIdsForQuality ({ state, commit }) {
    const collectionQuality = state.route.query.collection_quality ? state.route.query.collection_quality : null
    const qualityIds = state.filters.selections.collection_quality ?? collectionQuality
    const selection = 'assess_level_col'
    if (qualityIds && qualityIds.length > 0) {
      const query = encodeRsqlValue(transformToRSQL({
        operator: 'AND',
        operands: flatten([
          state.filters.satisfyAll.includes('collection_quality')
            ? createQuery(qualityIds, selection, state.filters.satisfyAll.includes('collection_quality'))
            : createInQuery(selection, qualityIds)
        ])
      }
      ))
      api.get(`${COLLECTION_QUALITY_INFO_API_PATH}?attrs=collection(id)&q` + query).then(response => {
        commit('SetCollectionIdsWithSelectedQuality', response)
      })
    } else {
      commit('SetCollectionIdsWithSelectedQuality', [])
    }
  },
  // Same as collections above
  GetBiobankIdsForQuality ({ state, commit }) {
    const biobankQuality = state.route.query.biobank_quality ? state.route.query.biobank_quality : null
    const qualityIds = state.filters.selections.biobank_quality ?? biobankQuality
    const selection = 'assess_level_bio'
    if (qualityIds && qualityIds.length > 0) {
      const query = encodeRsqlValue(transformToRSQL({
        operator: 'AND',
        operands: flatten([
          state.filters.satisfyAll.includes('biobank_quality')
            ? createQuery(qualityIds, selection, state.filters.satisfyAll.includes('biobank_quality'))
            : createInQuery(selection, qualityIds)
        ])
      }
      ))
      api.get(`${BIOBANK_QUALITY_INFO_API_PATH}?attrs=biobank(id)&q=` + query).then(response => {
        commit('SetBiobankIdsWithSelectedQuality', response)
      })
    } else {
      commit('SetBiobankIdsWithSelectedQuality', [])
    }
  },
  /*
   * Retrieves all collection identifiers matching the collection filters, and their biobanks
   */
  GetCollectionInfo ({ commit, getters }) {
    commit('SetCollectionInfo', undefined)
    let url = '/api/data/eu_bbmri_eric_collections?filter=id,biobank(id,name,label),name,label,collaboration_commercial,parent_collection&expand=biobank&size=10000&sort=biobank_label'
    if (getters.rsql) {
      url = `${url}&q=${encodeRsqlValue(getters.rsql)}`
    }
    api.get(url)
      .then(response => {
        commit('SetCollectionInfo', response)
        commit('SetDictionaries', response)
      }, error => {
        commit('SetError', error)
      })
  },
  /** Retrieves metadata for collection view attribute generator */
  GetCollectionMetadata ({ commit }) {
    const url = '/api/metadata/eu_bbmri_eric_collections'

    api.get(url)
      .then(response => {
        commit('SetCollectionMetadataDictionary', response)
      }, error => {
        commit('SetError', error)
      })
  },
  GetBiobankIds ({ commit, getters }) {
    commit('SetBiobankIds', undefined)
    let url = '/api/data/eu_bbmri_eric_biobanks?filter=id&size=10000&sort=name'
    if (getters.biobankRsql) {
      url = `${url}&q=${encodeRsqlValue(getters.biobankRsql)}`
    }
    api.get(url)
      .then(response => {
        commit('SetBiobankIds', response.items.map(item => item.data.id))
      }, error => {
        commit('SetError', error)
      })
  },
  GetBiobankReport ({ commit, state }, biobankId) {
    if (state.allBiobanks) {
      commit('SetBiobankReport', state.allBiobanks.find(it => it.id === biobankId))
      return
    }
    commit('SetLoading', true)
    api.get(`${BIOBANK_API_PATH}/${biobankId}?attrs=${COLLECTION_ATTRIBUTE_SELECTOR},${utils.qualityAttributeSelector('bio')},contact(*),*`).then(response => {
      commit('SetBiobankReport', response)
      commit('SetLoading', false)
    }, error => {
      commit('SetError', error)
      commit('SetLoading', false)
    })
  },
  GetCollectionReport ({ commit }, collectionId) {
    commit('SetLoading', true)
    api.get(`${COLLECTION_API_PATH}/${collectionId}?attrs=${COLLECTION_REPORT_ATTRIBUTE_SELECTOR()}`).then(response => {
      commit('SetCollectionReport', response)
      commit('SetLoading', false)
    }, error => {
      commit('SetError', error)
      commit('SetLoading', false)
    })
  },
  GetNegotiatorType ({ commit }) {
    api.get(`${NEGOTIATOR_API_PATH}`).then(response => {
      commit('SetPodium', response)
    }, error => {
      commit('SetError', error)
    })
  },
  async GetNetworkReport ({ commit }, networkId) {
    commit('SetNetworkBiobanks', undefined)
    commit('SetNetworkCollections', undefined)
    commit('SetNetworkReport', undefined)
    commit('SetLoading', true)

    const networks = api.get(`${NETWORK_API_PATH}/${networkId}`)
      .then(response => commit('SetNetworkReport', response))
      .finally(() => commit('SetLoading', false))
    const collections = api.get(`${COLLECTION_API_PATH}?q=network==${networkId}&num=10000&attrs=${COLLECTION_REPORT_ATTRIBUTE_SELECTOR()}`)
      .then(response => commit('SetNetworkCollections', response.items))
    const biobanks = api.get(`${BIOBANK_API_PATH}?q=network==${networkId}&num=10000`)
      .then(response => commit('SetNetworkBiobanks', response.items))

    await Promise.all([collections, biobanks, networks])
      .catch((error) => {
        commit('SetError', error)
      })
  },
  GetPodiumCollections ({ state, commit }) {
    if (state.isPodium && state.podiumCollectionIds.length === 0) { // only fetch once.
      api.get("/api/data/eu_bbmri_eric_collections?num=10000&filter=id&q=podium!=''").then(response => {
        commit('SetPodiumCollections', response)
      })
    }
  },
  /**
   * Transform the state into a NegotiatorQuery object.
   * Calls the DirectoryController method '/export' which answers with a URL
   * that redirects to a Negotiator server specified in the Directory settings
   */
  async SendToNegotiator ({ state, getters, commit }) {
    const options = {
      body: JSON.stringify(helpers.createNegotiatorQueryBody(state, getters, helpers.getLocationHref()))
    }
    return api.post('/plugin/directory/export', options)
      .then(helpers.setLocationHref, error => commit('SetError', error))
  },
  AddCollectionsToSelection ({ commit, getters }, { collections, bookmark }) {
    commit('SetCartValidationStatus', false)
    commit('SetCollectionsToSelection', { collections, bookmark })
    commit('SetSearchHistory', getters.getHumanReadableString)
  }
}
