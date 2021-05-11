/* istanbul ignore file */
import api from '@molgenis/molgenis-api-client'
import store from '../store'
import { encodeRsqlValue, transformToRSQL } from '@molgenis/rsql'
import { isCodeRegex } from '../../src/store/helpers'

// Async so we can fire and forget for performance.
async function cache (filterData) {
  store.commit('SetFilterOptionDictionary', filterData)
}

function retrieveFromCache (filterName) {
  return store.state.filterOptionDictionary[filterName] ?? []
}

function checkForBookmarkFilter (filterName, filterOptions) {
  if (!store.state.diagnosisAvailableFetched) {
    // If we have a cold start with a bookmark
    // we need to have the label for the selected filter
    const activeDiagnosisFilter = store.getters.activeFilters[filterName]

    if (activeDiagnosisFilter) {
      let options = []
      for (const activeFilter of activeDiagnosisFilter) {
        const optionToCache = filterOptions.filter(option => option.value === activeFilter)
        if (optionToCache) {
          options = options.concat(optionToCache)
        }
      }
      if (options.length) {
        cache({ filterName, filterOptions: options })
      }
    }
  }
}

export const genericFilterOptions = (tableName, filterName) => {
  return () => new Promise((resolve) => {
    const cachedOptions = retrieveFromCache(filterName)

    if (!cachedOptions.length) {
      api.get(`/api/v2/${tableName}`).then(response => {
        const filterOptions = response.items.map((obj) => { return { text: obj.label || obj.name, value: obj.id } })
        cache({ filterName, filterOptions })
        resolve(filterOptions)
      })
    } else {
      resolve(cachedOptions)
    }
  })
}

/** Specific logic for diagnosis available filter */
const createDiagnosisLabelQuery = (query) => transformToRSQL({ selector: 'label', comparison: '=like=', arguments: query })
const createDiagnosisCodeQuery = (query) => transformToRSQL({ selector: 'code', comparison: '=like=', arguments: query.toUpperCase() })
/** */

export const diagnosisAvailableFilterOptions = (tableName, filterName) => {
  // destructure the query part from the multi-filter
  return ({ query, queryType }) => new Promise((resolve) => {
    let url = `/api/v2/${tableName}`

    if (query) {
      // initial load, values are id's
      if (queryType === 'in') {
        url = `${url}?q=${encodeRsqlValue(`id=in=(${query})`)}`
      } else if (isCodeRegex.test(query)) {
        url = `${url}?q=${encodeRsqlValue(createDiagnosisCodeQuery(query))}&sort=code`
      } else {
        url = `${url}?q=${encodeRsqlValue(createDiagnosisLabelQuery(query))}`
      }
    }

    api.get(url).then(response => {
      const filterOptions = response.items.map((obj) => { return { text: `[ ${obj.code} ] - ${obj.label || obj.name}`, value: obj.id } })
      checkForBookmarkFilter(filterName, filterOptions)
      resolve(filterOptions)
    })
  })
}

export const collaborationTypeFilterOptions = () => {
  const filterOptions = [{ text: 'Commercial use', value: 'true' }, { text: 'Non-commercial use', value: 'false' }]

  return () => new Promise((resolve) => {
    resolve(filterOptions)
  })
}

export const commonNetworkFilterOptions = () => {
  return () => new Promise((resolve) => {
    resolve([
      { text: 'Common SOPs', value: 'common_sops' },
      { text: 'Common Collection Focus', value: 'common_collection_focus' },
      { text: 'Common Charter', value: 'common_charter' },
      { text: 'Common Data Access Policy', value: 'common_data_access_policy' },
      { text: 'Common Sample Access Policy', value: 'common_sample_access_policy' },
      { text: 'Common MTA', value: 'common_mta' },
      { text: 'Common Image Access Policy', value: 'common_image_access_policy' },
      { text: 'Common Image MTA', value: 'common_image_mta' },
      { text: 'Common URL', value: 'common_url' }
    ])
  })
}
