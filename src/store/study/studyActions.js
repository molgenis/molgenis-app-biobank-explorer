import api from '@molgenis/molgenis-api-client'
import { STUDY_API_PATH } from '../actions'
/**/
import initialStudyColumns from '../../config/initialStudyColumns'

export const STUDY_REPORT_ATTRIBUTE_SELECTOR = () => {
  const studyRsql = initialStudyColumns.filter(isc => isc.rsql).map(prop => prop.rsql)

  let rsqlStart = '*,'

  if (studyRsql.length) {
    rsqlStart += studyRsql.join(',')
  }

  return `${rsqlStart}collection(*),also_known(*)`
}

export const studyActions = {

  GetStudyReport ({ commit }, studyId) {
    commit('SetLoading', true)
    api.get(`${STUDY_API_PATH}/${studyId}?attrs=${STUDY_REPORT_ATTRIBUTE_SELECTOR()}`).then(response => {
      commit('SetStudyReport', response)
      commit('SetLoading', false)
    }, error => {
      commit('SetError', error)
      commit('SetLoading', false)
    })
  }
}
