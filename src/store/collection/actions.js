import api from '@molgenis/molgenis-api-client'

export const collectionActions = {

  async initializeCollectionRelationData ({ commit }) {
    const url = '/api/data/eu_bbmri_eric_collections?filter=id,biobank(id,name,label),name,label,collaboration_commercial,parent_collection&expand=biobank&size=10000&sort=biobank_label'

    const response = await api.get(url).catch(error => commit('SetError', error))
    commit('SetAllCollectionRelationData', response)
  }
}
