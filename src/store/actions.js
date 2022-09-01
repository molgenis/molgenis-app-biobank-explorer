
import api from '@molgenis/molgenis-api-client'
import helpers from './helpers'
import 'array-flat-polyfill'

import { biobankActions } from './biobank/biobankActions'

import { configurationActions } from './configuration/configurationActions'
import { collectionActions, COLLECTION_REPORT_ATTRIBUTE_SELECTOR } from './collection/collectionActions'

/* API PATHS */
const BIOBANK_API_PATH = '/api/v2/eu_bbmri_eric_biobanks'
export const COLLECTION_API_PATH = '/api/v2/eu_bbmri_eric_collections'

const NETWORK_API_PATH = '/api/v2/eu_bbmri_eric_networks'
const NEGOTIATOR_API_PATH = '/api/v2/sys_negotiator_NegotiatorConfig'
const NEGOTIATOR_CONFIG_API_PATH = '/api/v2/sys_negotiator_NegotiatorEntityConfig?attrs=*,biobankId(refEntityType)'
/**/

/**  Query Parameters */
export const COLLECTION_ATTRIBUTE_SELECTOR = 'collections(id,description,materials,diagnosis_available(label,uri,code),name,type,order_of_magnitude(*),size,sub_collections(name,id,sub_collections(*),parent_collection,order_of_magnitude,materials(label,uri),data_categories),parent_collection,quality(*),data_categories(label,uri))'

export default {
  ...collectionActions,
  ...biobankActions,
  ...configurationActions,
  GetNegotiatorEntities ({ commit }) {
    api.get(NEGOTIATOR_CONFIG_API_PATH).then(response => {
      commit('SetNegotiatorEntities', response)
    })
  },
  GetNegotiatorType ({ commit }) {
    api.get(`${NEGOTIATOR_API_PATH}`).then(response => {
      commit('SetPodium', response)
    }, error => {
      commit('SetError', error)
    })
  },
  async GetNetworkReport ({ commit }, networkId) {
    commit('SetNetworkBiobanks', undefined)
    commit('SetNetworkCollections', undefined)
    commit('SetNetworkReport', undefined)
    commit('SetLoading', true)

    const networks = api.get(`${NETWORK_API_PATH}/${networkId}`)
      .then(response => commit('SetNetworkReport', response))
      .finally(() => commit('SetLoading', false))
    const collections = api.get(`${COLLECTION_API_PATH}?q=network==${networkId}&num=10000&attrs=${COLLECTION_REPORT_ATTRIBUTE_SELECTOR()}`)
      .then(response => commit('SetNetworkCollections', response.items))
    const biobanks = api.get(`${BIOBANK_API_PATH}?q=network==${networkId}&num=10000`)
      .then(response => commit('SetNetworkBiobanks', response.items))

    await Promise.all([collections, biobanks, networks])
      .catch((error) => {
        commit('SetError', error)
      })
  },
  async GetUpdateFilter ({ state, commit }, { filterName, activeFilters }) {
    /**
     * Construct query for all filter options of the currently expanded filter
     * query the results using molgenis API and use "total" attribute to create a list
     * of filter options: If result.total > 0 : append the corresponding filter option to the reduced list
     * if result.total == 0, exclude the specific option (dont display it for corresponding filter)
     */
    console.log(filterName)
    const filterCheckPromises = []
    const reducedFilterOptions = []

    if (Object.keys(activeFilters).length === 0) {
      console.log('Resetting...')
      commit('ResetFilterOptionsOverride', { filterName, reducedFilterOptions })
      return 0
    }
    // exclude active filters from current expanded filter
    const activeFilterNames = Object.keys(activeFilters).filter(e => e !== filterName)
    console.log(Object.keys(activeFilters))
    // if (Object.keys(activeFilters).length === 0) {
    //   console.log('Resetting...')
    //   return 0
    // }
    let url = '/api/data/eu_bbmri_eric_collections?size=1&filter=id&q='
    // iterate over all active filter options and create query from current selection(s)
    // type=in=(COHORT);
    // for (const activeFilterName in activeFilterNames) {
    //   const name = activeFilterNames[activeFilterName]
    //   const orQueryString = []
    //   const orOptions = orQueryString.join(';')
    //   url = url + orOptions + ';'
    // }
    for (const activeFilterName in activeFilterNames) {
      const name = activeFilterNames[activeFilterName]
      if (state.filters.satisfyAll.includes(name)) {
        console.log('Match all:')
        console.log(name)
        const orQueryString = []
        for (const option of activeFilters[name]) {
          orQueryString.push(name + '=in=(' + option + ')')
        }
        const orOptions = orQueryString.join(';')
        url = url + orOptions + ';'
      } else {
        console.log('Match any:')
        console.log(name)
        url = url + name + '=in=(' + activeFilters[name] + ');'
      }
    }
    console.log(url)
    // const activeOptions = activeFilters[name].join(operator === 'OR' ? ',' : ';')
    // .join(operator === 'OR' ? ',' : ';')
    // iterate over options of the ONE filter that is currently expanded and construct query for each option
    for (const option of state.filterOptionDictionary[filterName]) {
      const filterOption = option.value
      const optionString = filterName + '=in=(' + filterOption + ')'
      // append URLs to list, use Promise.all on list
      const response = api.get(url + optionString)
      // if (response_.total > 0) {
      //   reducedFilterOptions.push(filterOption)
      // }
      filterCheckPromises.push(response)
    }

    if (activeFilters[filterName]) {
      for (const activeOption of activeFilters[filterName]) {
        if (!reducedFilterOptions.includes(activeOption)) {
          reducedFilterOptions.push(activeOption)
        }
      }
    }
    // for (const keep of activeFilters[filterName]) {
    //   console.log(keep)
    //   reducedFilterOptions.push(keep)
    // }
    // Promise.all(filterCheckPromises).then((values) => { console.log(values) })
    // Promise.all(filterCheckPromises).then((values) => { values.filter(val => val.page.totalElements > 0 ? reducedFilterOptions.push(state.filterOptionDictionary[filterName][val].value) : null) })

    Promise.all(filterCheckPromises).then((values) => {
      for (const val in values) {
        if (values[val].page.totalElements > 0) {
          reducedFilterOptions.push(state.filterOptionDictionary[filterName][val].value)
        }
      }
      commit('SetUpdateFilter', { filterName, reducedFilterOptions })
    })
  },
  /**
   * Transform the state into a NegotiatorQuery object.
   * Calls the DirectoryController method '/export' which answers with a URL
   * that redirects to a Negotiator server specified in the Directory settings
   */
  async SendToNegotiator ({ state, getters, commit }) {
    const options = {
      body: JSON.stringify(helpers.createNegotiatorQueryBody(state, getters, helpers.getLocationHref()))
    }
    return api.post('/plugin/directory/export', options)
      .then(helpers.setLocationHref, error => commit('SetError', error))
  }
}
