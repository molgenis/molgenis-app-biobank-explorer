import api from '@molgenis/molgenis-api-client'
// Generic filter option (' table' ): Promise

export const genericFilterOptions = (tableName) => {
  return () => new Promise((resolve) => {
    api.get(`/api/v2/${tableName}`).then(response => {
      resolve(response.items.map((obj) => { return { text: obj.label || obj.name, value: obj.id } }))
    })
  })
}

// Multifilter option ( name, ? ): Promise

// Custom (name, option[]): Promise

export default {
  genericFilterOptions
}
