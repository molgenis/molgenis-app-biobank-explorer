import api from '@molgenis/molgenis-api-client'

export const generalActions = {

  initializeCollectionRelationData ({ commit }) {
    const url = '/api/data/eu_bbmri_eric_collections?filter=id,biobank(id,name,label),name,label,collaboration_commercial,parent_collection&expand=biobank&size=10000&sort=biobank_label'

    api.get(url)
      .then(response => {
        commit('SetAllCollectionRelationData', response)
      }, error => {
        commit('SetError', error)
      })
  }
}
