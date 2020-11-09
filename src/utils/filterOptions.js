/* istanbul ignore file */

import api from '@molgenis/molgenis-api-client'
import { encodeRsqlValue, transformToRSQL } from '@molgenis/rsql'
import { covid19BiobankNetworkSelectionId, covid19CollectionNetworkSelectionId } from '../store/helpers/covid19Helper'

// Generic filter option (' table' ): Promise

export const genericFilterOptions = (tableName) => {
  return () => new Promise((resolve) => {
    api.get(`/api/v2/${tableName}`).then(response => {
      resolve(response.items.map((obj) => { return { text: obj.label || obj.name, value: obj.id } }))
    })
  })
}

/** Specific logic for diagnosis available filter */
const isCodeRegex = /^([A-Z]|[XVI]+)(\d{0,2}(-([A-Z]\d{0,2})?|\.\d{0,3})?)?$/i
const createDiagnosisIdQuery = (query) => encodeRsqlValue(transformToRSQL({ selector: 'id', comparison: '=q=', arguments: query }))
const createDiagnosisLabelQuery = (query) => transformToRSQL({ selector: 'label', comparison: '=like=', arguments: query })
const createDiagnosisCodeQuery = (query) => transformToRSQL({ selector: 'code', comparison: '=like=', arguments: query.toUpperCase() })
/** */

export const covid19NetworkFilterOptions = () => {
  return new Promise((resolve) => {
    const covid19NetworkData = [{ value: covid19BiobankNetworkSelectionId, text: 'Biobanks providing COVID-19 services' },
      { value: covid19CollectionNetworkSelectionId, text: 'COVID-19 collections' }]
    resolve(covid19NetworkData)
  })
}
export const diagnosisAvailableFilterOptions = (tableName) => {
  // destructure the query part from the multi-filter
  return ({ query, queryType }) => new Promise((resolve) => {
    let url = `/api/v2/${tableName}`

    if (query) {
      // initial load, values are ids
      if (queryType === 'in') {
        url = `${url}?q=${encodeRsqlValue(createDiagnosisIdQuery(query))}`
      } else if (isCodeRegex.test(query)) {
        url = `${url}?q=${encodeRsqlValue(createDiagnosisCodeQuery(query))}&sort=code`
      } else {
        url = `${url}?q=${encodeRsqlValue(createDiagnosisLabelQuery(query))}`
      }
    }

    api.get(url).then(response => {
      resolve(response.items.map((obj) => { return { text: `[ ${obj.code} ] - ${obj.label || obj.name}`, value: obj.id } }))
    })
  })
}
