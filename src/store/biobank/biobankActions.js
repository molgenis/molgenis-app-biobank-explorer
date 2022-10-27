import utils from '../../utils'
import api from '@molgenis/molgenis-api-client'
import { encodeRsqlValue, transformToRSQL } from '@molgenis/rsql'
import { COLLECTION_ATTRIBUTE_SELECTOR } from '../actions'

export const BIOBANK_API_PATH = '/api/v2/eu_bbmri_eric_biobanks'

export const biobankActions = {
  QueryBiobanks ({ state, commit, getters }) {
    commit('SetBiobankIds', undefined)

    let size = state.pageSize

    if (getters.biobankRsql) {
      size = 10000
    }

    let url = `/api/data/eu_bbmri_eric_biobanks?filter=id&page=${state.currentPage - 1}&size=${size}&sort=name`
    if (getters.biobankRsql) {
      url = `${url}&q=${encodeRsqlValue(getters.biobankRsql)}`
    }

    api.get(url)
      .then(response => {
        commit('SetBiobankIds', response.items.map(item => item.data.id))
        commit('SetBiobankCount', response)
      }, error => {
        commit('SetError', error)
      })
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
  GetBiobankReport ({ commit, state }, biobankId) {
    if (state.allBiobanks) {
      commit('SetBiobankReport', state.allBiobanks.find(it => it.id === biobankId))
      return
    }
    commit('SetLoading', true)
    api.get(`${BIOBANK_API_PATH}/${biobankId}?attrs=${COLLECTION_ATTRIBUTE_SELECTOR},${utils.qualityAttributeSelector('bio')},contact(*),head(first_name,last_name,role),*`).then(response => {
      commit('SetBiobankReport', response)
      commit('SetLoading', false)
    }, error => {
      commit('SetError', error)
      commit('SetLoading', false)
    })
  }
}
