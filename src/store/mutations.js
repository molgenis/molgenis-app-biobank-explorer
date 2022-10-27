import Vue from 'vue'
import { createBookmark } from '../utils/bookmarkMapper'
import { createFilters } from '../config/facetConfigurator'
import { collectionMutations } from './collection/collectionMutations'
import { biobankMutations } from './biobank/biobankMutations'
import { configurationMutations } from './configuration/configurationMutations'

function mapLegacyFilterToNewFilter (state, query, oldFilterName, newFilterName) {
  const queryValues = decodeURIComponent(query[oldFilterName]).split(',')

  if (state.filters.selections[newFilterName]) {
    state.filters.selections[newFilterName] = [...new Set(state.filters.selections[newFilterName].concat(queryValues))]
  } else {
    state.filters.selections[newFilterName] = queryValues
  }
}

export default {
  ...biobankMutations,
  ...collectionMutations,
  ...configurationMutations,
  /**
   * Updates filter and keeps a history of searches
   * @param {*} state;
   * @param {*} filterUpdate; Object { name, value: Array<Object> | Object }
   * e.g:
   * to add: { name: myFilterName, value: { text: 'MyFilterLabel', value: 'MyFilterId' } }
   * to remove: { name: myFilterName, value: { text: 'MyFilterLabel', value: '' } }
   */
  UpdateFilterSelection (state, filterUpdate) {
    /** reset the page as we query new results. */
    state.currentPage = 1

    const currentFilterSelection = state.filters.selections
    const currentLabels = state.filters.labels

    let tempFilterUpdate = filterUpdate

    /** check if it's single filter input */
    if (Object.prototype.hasOwnProperty.call(filterUpdate, 'name')) {
      tempFilterUpdate = { [filterUpdate.name]: filterUpdate.value }
    }

    const newSelections = {}
    const newFilterLabels = {}

    for (const propertyName in tempFilterUpdate) {
      const filterValue = tempFilterUpdate[propertyName]

      /** check if empty, taking care of a 0 value, in case of a number filter */
      if (filterValue === undefined ||
        filterValue === '' ||
        (Array.isArray(filterValue) && !filterValue.length) ||
        (!Array.isArray(filterValue) && typeof filterValue === 'object' &&
          (!filterValue.value.length || !filterValue.value[0].length))) {
        /** remove the empty filter and the label */
        delete currentFilterSelection[propertyName]
        delete currentLabels[propertyName]
        continue
      }

      /** check if it's an array of filter values, e.g. material */
      if (Array.isArray(filterValue) && typeof filterValue[0] === 'object') { /** object array filter, e.g Collection Quality marks */
        newSelections[propertyName] = filterValue.map(filter => filter.value)
        newFilterLabels[propertyName] = filterValue.map(filter => filter.text)
      } else if (!Array.isArray(filterValue) && typeof filterValue === 'object') { /** single added filter e.g covid_19 network */
        newSelections[propertyName] = [filterValue.value]
        newFilterLabels[propertyName] = [filterValue.text]
      } else { /** a filter with only one option e.g. search */
        newSelections[propertyName] = filterValue
        /** we only get one filter value, so we don't know which label is attached, clear all
         * let humanReadableString figure it out. */
        delete currentLabels[propertyName]
      }
    }

    /** create new filter selection object and then put that on the state */
    const filterSelection = { ...currentFilterSelection, ...newSelections }

    Vue.set(state.filters, 'selections', filterSelection)

    const labels = { ...currentLabels, ...newFilterLabels }
    Vue.set(state.filters, 'labels', labels)

    createBookmark(state.filters, state.selectedCollections)
  },
  SetFilterLoading (state, { filterName }) {
    Vue.set(state, 'filterLoading', filterName)
  },
  SetFilterActivation (state, { filterName, activation }) {
    if (activation) {
      Vue.set(state, 'filterExpanded', filterName)
    } else {
      Vue.set(state, 'filterExpanded', 'None')
    }
  },
  ResetFilterLoading (state) {
    const filterLoadingDict = {}
    const filters = state.filterFacets.map(fd => fd.name)
    for (const f of filters) {
      filterLoadingDict[f] = 'None'
    }
    Vue.set(state, 'filterLoadingDict', filterLoadingDict)
    Vue.set(state, 'filterLoading', 'None')
  },
  ResetFilterOptionsOverride (state) {
    Vue.set(state, 'filterOptionsOverride', {})
  },
  SetUpdateFilter (state, { filterName, reducedFilterOptions, lastBaseQuery }) {
    state.filterOptionsOverride[filterName] = []
    Vue.set(state, 'filterOptionsOverride', { ...state.filterOptionsOverride, ...{ [filterName]: reducedFilterOptions } })
    Vue.set(state, 'filterLoading', 'None')
    Vue.set(state, 'lastUpdatedFilter', filterName)
    Vue.set(state, 'lastBaseQuery', lastBaseQuery)
    Vue.set(state, 'filterLoadingDict', { ...state.filterLoadingDict, ...{ [filterName]: lastBaseQuery } })
  },
  UpdateFilterSatisfyAll (state, { name, value }) {
    if (value && !state.filters.satisfyAll.includes(name)) {
      state.filters.satisfyAll.push(name)
    } else {
      if (state.filters.satisfyAll.includes(name)) {
        state.filters.satisfyAll.splice(state.filters.satisfyAll.indexOf(name), 1)
      }
    }
    createBookmark(state.filters, state.selectedCollections)
  },
  SetFilterOptionDictionary (state, { filterName, filterOptions }) {
    /** only cache it once */
    if (!state.filterOptionDictionary[filterName]) {
      Vue.set(state.filterOptionDictionary, filterName, filterOptions)

      /** to let the filter know, no more caching needed */
      if (filterName === 'diagnosis_available') {
        state.diagnosisAvailableFetched = true
      }
    }
  },
  SetNetworkReport (state, network) {
    state.networkReport.network = network
  },
  SetNetworkCollections (state, collections) {
    state.networkReport.collections = collections
  },
  SetNetworkBiobanks (state, biobanks) {
    state.networkReport.biobanks = biobanks
  },
  SetCartValidationStatus (state, status) {
    state.cartValid = status
  },
  SetSearchHistory (state, history) {
    if (history === '') {
      history = 'No filters used.'
    }

    /** only add if this is a different query than before */
    if (state.searchHistory.length && !state.searchHistory[state.searchHistory.length - 1] !== history) {
      state.searchHistory.push(history)
    } else {
      /** we can safely write history here. */
      state.searchHistory.push(history)
    }
  },
  /**
   *
   * @param state
   * @param params
   */
  MapQueryToState (state) {
    /** bookmark has been altered in another view */
    if (!state.cartValid) return
    const query = state.route.query

    const keysInQuery = Object.keys(query)
    /** we load the filters, grab the names, so we can loop over it to map the selections */
    const filters = state.filterFacets.map(fd => fd.name)
      .filter(name => keysInQuery.includes(name))
      .filter(fr => !['search', 'nToken'].includes(fr)) /** remove specific filters, else we are doing them again. */

    if (query.search) {
      Vue.set(state.filters.selections, 'search', decodeURIComponent(query.search))
    }

    if (query.nToken) {
      state.nToken = query.nToken
    }

    if (query.satisfyAll) {
      Vue.set(state.filters, 'satisfyAll', decodeURIComponent(query.satisfyAll).split(','))
    }

    if (query.cart) {
      const decoded = decodeURIComponent(query.cart)
      const cartIdString = atob(decoded)
      const cartIds = cartIdString.split(',')
      state.selectedCollections = cartIds.map(id => ({ label: state.collectionNameDictionary[id], value: id }))

      /** add the beginning of history if from a link-back url */
      if (state.searchHistory.length === 0) {
        state.searchHistory.push('Starting with a preselected list of collections')
      }
    }

    for (const filterName of filters) {
      if (query[filterName]) {
        let queryValues = decodeURIComponent(query[filterName]).split(',')
        /** if it's not ORPHA it's ICD-10, then we have to add urn:miriam:icd: to make it an id
         * for backwards compatibility if it's not present */
        if (filterName === 'diagnosis_available') {
          queryValues = queryValues.map(value => {
            const isOrphanet = value.match(/^ORPHA/g)
            const isICD10 = value.match(/^urn:miriam:icd:/g)
            return (!isOrphanet && !isICD10) ? `urn:miriam:icd:${value}` : value
          })
        }
        Vue.set(state.filters.selections, filterName, queryValues)
      }
    }

    /** legacy mappings */
    if (query.collection_quality) {
      mapLegacyFilterToNewFilter(state, query, 'collection_quality', 'combined_quality')
    }

    if (query.biobank_quality) {
      mapLegacyFilterToNewFilter(state, query, 'biobank_quality', 'combined_quality')
    }

    if (query.collection_network) {
      mapLegacyFilterToNewFilter(state, query, 'collection_network', 'network')
    }
    if (query.biobank_network) {
      mapLegacyFilterToNewFilter(state, query, 'biobank_network', 'network')
    }
    /** end legacy mappings */
  },
  ConfigureFilters (state) {
    state.filterFacets = createFilters(state)
  },
  ClearActiveFilters (state) {
    state.filters.selections = {}
    state.filters.satisfyAll = []
    createBookmark(state.filters, state.selectedCollections)
  },
  SetError (state, error) {
    state.error = error
  },
  SetLoading (state, loading) {
    state.isLoading = loading
  },
  SetCurrentPage (state, currentPage) {
    state.currentPage = currentPage
  },
  SetNotification (state, notification) {
    state.notification = notification
  }
}
