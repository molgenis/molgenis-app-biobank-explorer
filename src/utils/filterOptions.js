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
      const options = []
      for (const activeFilter of activeDiagnosisFilter) {
        const optionToCache = filterOptions.filter(option => option.value === activeFilter)
        if (optionToCache) {
          options.push(optionToCache)
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
      // initial load, values are code
      if (queryType === 'in') {
        url = `${url}?q=${encodeRsqlValue(`code=in=(${query})`)}`
      } else if (isCodeRegex.test(query)) {
        url = `${url}?q=${encodeRsqlValue(createDiagnosisCodeQuery(query))}&sort=code`
      } else {
        url = `${url}?q=${encodeRsqlValue(createDiagnosisLabelQuery(query))}`
      }
    }

    api.get(url).then(response => {
      const filterOptions = response.items.map((obj) => { return { text: `[ ${obj.code} ] - ${obj.label || obj.name}`, value: obj.code } })
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
