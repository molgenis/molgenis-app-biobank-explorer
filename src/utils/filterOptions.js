/* istanbul ignore file */

import api from '@molgenis/molgenis-api-client'
import { covid19BiobankNetworkSelectionId, covid19CollectionNetworkSelectionId } from '../store/helpers/covid19Helper'

// Generic filter option (' table' ): Promise

export const genericFilterOptions = (tableName) => {
  return () => new Promise((resolve) => {
    api.get(`/api/v2/${tableName}`).then(response => {
      resolve(response.items.map((obj) => { return { text: obj.label || obj.name, value: obj.id } }))
    })
  })
}

// Multifilter option ( name, ? ): Promise

export const covid19NetworkFilterOptions = () => {
  return new Promise((resolve) => {
    const covid19NetworkData = [{ value: covid19BiobankNetworkSelectionId, text: 'Biobanks providing COVID-19 services' },
      { value: covid19CollectionNetworkSelectionId, text: 'COVID-19 collections' }]
    resolve(covid19NetworkData)
  })
}

export default {
  genericFilterOptions,
  covid19NetworkFilterOptions
}
