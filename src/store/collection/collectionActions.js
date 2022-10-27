import api from '@molgenis/molgenis-api-client'
import { encodeRsqlValue } from '@molgenis/rsql'
import { COLLECTION_API_PATH } from '../actions'
/**/
import initialCollectionColumns from '../../config/initialCollectionColumns'

export const COLLECTION_REPORT_ATTRIBUTE_SELECTOR = () => {
  const collectionRsql = initialCollectionColumns.filter(icc => icc.rsql).map(prop => prop.rsql)

  let rsqlStart = '*,'

  if (collectionRsql.length) {
    rsqlStart += collectionRsql.join(',')
  }

  return `${rsqlStart},biobank(id,name,juridical_person,country,url,contact),head(first_name,last_name,role),contact(title_before_name,first_name,last_name,title_after_name,email,phone),sub_collections(name,id,sub_collections(*),parent_collection,order_of_magnitude,materials(label,uri),data_categories)`
}

export const collectionActions = {

  async initializeCollectionRelationData ({ commit }) {
    // biobank_label is a mapping in the collection table to the name column of biobank table
    const url = '/api/data/eu_bbmri_eric_collections?filter=id,biobank(id,name,label),name,label,collaboration_commercial,parent_collection&expand=biobank&size=10000&sort=biobank_label'

    const response = await api.get(url).catch(error => commit('SetError', error))
    commit('SetAllCollectionRelationData', response)
  },
  /*
   * Retrieves all collection identifiers matching the collection filters, and their biobanks
   */
  async GetCollectionInfo ({ state, commit, getters, dispatch }) {
    // check if initial data is present, else fetch that first
    if (state.collectionRelationData.length === 0) {
      await dispatch('initializeCollectionRelationData')
    }

    commit('SetCollectionInfo', undefined)
    let url = '/api/data/eu_bbmri_eric_collections?filter=id&size=10000&sort=biobank_label&expand=materials,diagnosis_available'
    if (getters.rsql) {
      url = `${url}&q=${encodeRsqlValue(getters.rsql)}`
    }
    api.get(url)
      .then(response => {
        commit('SetCollectionInfo', response)
        commit('CalculateBiobankCount', getters)
      }, error => {
        commit('SetError', error)
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
  AddCollectionsToSelection ({ commit, getters }, { collections, bookmark }) {
    commit('SetCartValidationStatus', false)
    commit('SetCollectionsToSelection', { collections, bookmark })
    commit('SetSearchHistory', getters.getHumanReadableString)
  },
  GetPodiumCollections ({ state, commit }) {
    if (state.isPodium && state.podiumCollectionIds.length === 0) { // only fetch once.
      api.get("/api/data/eu_bbmri_eric_collections?num=10000&filter=id&q=podium!=''").then(response => {
        commit('SetPodiumCollections', response)
      })
    }
  }
}
