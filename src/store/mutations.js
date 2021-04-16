import Vue from 'vue'
import { createBookmark } from '../utils/bookmarkMapper'
import { fixCollectionTree } from './helpers'
import filterDefinitions from '../utils/filterDefinitions'

const negotiatorConfigIds = ['directory', 'bbmri-eric-model']

export default {
  /**
   * Updates filter and keeps a history of searches
   * @param {*} state;
   * @param {*} filterUpdate; Object { name, value: Array<Object> | Object }
   * e.g:
   * to add: { name: myFilterName, value: { text: 'MyFilterLabel', value: 'MyFilterId' } }
   * to remove: { name: myFilterName, value: { text: 'MyFilterLabel', value: '' } }
   */
  UpdateFilterSelection (state, filterUpdate) {
    const currentFilterSelection = state.filters.selections
    const currentLabels = state.filters.labels

    let tempFilterUpdate = filterUpdate

    // check if it's single filter input
    if (Object.prototype.hasOwnProperty.call(filterUpdate, 'name')) {
      tempFilterUpdate = { [filterUpdate.name]: filterUpdate.value }
    }

    const newSelections = {}
    const newFilterLabels = {}

    for (const propertyName in tempFilterUpdate) {
      const filterValue = tempFilterUpdate[propertyName]

      // check if empty, taking care of a 0 value, in case of a number filter
      if (filterValue === undefined ||
        filterValue === '' ||
        (Array.isArray(filterValue) && !filterValue.length) ||
        (!Array.isArray(filterValue) && typeof filterValue === 'object' &&
        (!filterValue.value.length || !filterValue.value[0].length))) {
        // remove the empty filter and the label
        delete currentFilterSelection[propertyName]
        delete currentLabels[propertyName]
        continue
      }

      // check if it's an array of filter values, e.g. material
      if (Array.isArray(filterValue) && typeof filterValue[0] === 'object') { // object array filter, e.g Collection Quality marks
        newSelections[propertyName] = filterValue.map(filter => filter.value)
        newFilterLabels[propertyName] = filterValue.map(filter => filter.text)
      } else if (!Array.isArray(filterValue) && typeof filterValue === 'object') { // single added filter e.g covid_19 network
        newSelections[propertyName] = [filterValue.value]
        newFilterLabels[propertyName] = [filterValue.text]
      } else { // a filter with only one option e.g. search
        newSelections[propertyName] = filterValue
        // we only get one filter value, so we don't know which label is attached, clear all
        // let humanReadableString figure it out.
        delete currentLabels[propertyName]
      }
    }

    // create new filter selection object and then put that on the state
    const filterSelection = { ...currentFilterSelection, ...newSelections }

    Vue.set(state.filters, 'selections', filterSelection)

    const labels = { ...currentLabels, ...newFilterLabels }
    Vue.set(state.filters, 'labels', labels)

    createBookmark(filterSelection, state.selectedCollections, state.filters.satisfyAll)
  },
  UpdateFilterSatisfyAll (state, { name, value }) {
    if (value && !state.filters.satisfyAll.includes(name)) {
      state.filters.satisfyAll.push(name)
    } else {
      if (state.filters.satisfyAll.includes(name)) {
        state.filters.satisfyAll.splice(state.filters.satisfyAll.indexOf(name), 1)
      }
    }
    createBookmark(state.filters.selections, state.selectedCollections, state.filters.satisfyAll)
  },
  /**
   * Reset all filters in the state
   */
  ResetFilters (state) {
    state.filters.selections = {}
    state.filters.satisfyAll = []
  },
  SetBiobanks (state, biobanks) {
    biobanks.forEach(biobank => {
      Vue.set(state.biobanks, biobank.id, fixCollectionTree(biobank))
    })
  },
  SetBiobankIds (state, biobankIds) {
    state.biobankIds = biobankIds
  },
  SetBiobankInfo (state, response) {
    if (response === undefined) {
      state.biobankInfo = response
      return
    }
    state.biobankInfo = response.items.map(item => ({
      id: item.data.id,
      name: item.data.name,
      networkIds: item.data.network.items.map(item => item.data.id)
    }))
  },
  // TODO name more specifically
  SetDictionaries (state, response) {
    const collections = response.items.map(item => (
      {
        id: item.data.id,
        label: item.data.label || item.data.name,
        biobankName: item.data.biobank.data.label || item.data.biobank.data.name,
        commercialUse: item.data.collaboration_commercial
      }))

    collections.forEach(function (collection) {
      state.collectionBiobankDictionary[collection.id] = collection.biobankName
      state.collectionDictionary[collection.id] = collection.label
    })

    const newNonCommercialCollections = state.nonCommercialCollections.concat(collections.filter(collection => !collection.commercialUse).map(collection => collection.id))
    state.nonCommercialCollections = [...new Set(newNonCommercialCollections)]
  },
  SetNetworks (state, networks) {
    networks.forEach(network => {
      Vue.set(state.networks, network.id, network)
    })
  },
  SetNetworksIds (state, networksIds) {
    state.networksIds = networksIds
  },
  SetQualityStandardDictionary (state, response) {
    // Combine arrays from two tables and deduplicate
    const allStandards = [...new Set(
      response.map(response => response.items)
        .reduce((prev, next) => prev.concat(next)))
    ]
    const qualityStandardsDictionary = {}

    allStandards.forEach((standard) => {
      qualityStandardsDictionary[standard.label] = standard.description || ''
    })

    state.qualityStandardsDictionary = qualityStandardsDictionary
  },
  SetFilterOptionDictionary (state, { filterName, filterOptions }) {
    // only cache it once
    if (!state.filterOptionDictionary[filterName]) {
      Vue.set(state.filterOptionDictionary, filterName, filterOptions)

      // to let the filter know, no more caching needed
      if (filterName === 'diagnosis_available') {
        state.diagnosisAvailableFetched = true
      }
    }
  },
  SetCollectionInfo (state, response) {
    if (response === undefined) {
      state.collectionInfo = response
      return
    }

    const collectionInfo = response.items.map(item => ({
      collectionId: item.data.id,
      collectionName: item.data.label || item.data.name,
      biobankId: item.data.biobank.data.id,
      networkIds: item.data.network.items.map(item => item.data.id),
      isSubcollection: item.data.parent_collection !== undefined
    }))
    state.collectionInfo = collectionInfo
  },
  /**
   * Store a single biobank in the state for showing a biobank report
   * @param state
   * @param biobank response object from the server containing meta and items for a single biobank
   */
  SetBiobankReport (state, biobank) {
    state.biobankReport = biobank
  },
  SetCollectionReport (state, collection) {
    state.collectionReport = collection
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
  // methods for rehydrating bookmark
  SetCollectionIdsWithSelectedQuality (state, response) {
    if (response.items && response.items.length > 0) {
      state.collectionIdsWithSelectedQuality = []
      state.collectionIdsWithSelectedQuality = [...new Set(response.items.map(ri => ri.collection.id))]
    } else {
      const collectionQualityFilter = state.filters.selections.collection_quality
      const isCollectionQualityFilterActive = (collectionQualityFilter && collectionQualityFilter.length > 0) || state.route.query.collection_quality

      state.collectionIdsWithSelectedQuality = isCollectionQualityFilterActive ? ['no-collection-found'] : []
    }
  },
  SetBiobankIdsWithSelectedQuality (state, response) {
    if (response.items && response.items.length > 0) {
      state.biobankIdsWithSelectedQuality = []
      state.biobankIdsWithSelectedQuality = [...new Set(response.items.map(ri => ri.biobank.id))]
    } else {
      const biobankQualityFilter = state.filters.selections.biobank_quality
      const isBiobankQualityFilterActive = (biobankQualityFilter && biobankQualityFilter.length > 0) || state.route.query.biobank_quality

      state.biobankIdsWithSelectedQuality = isBiobankQualityFilterActive ? ['no-biobank-found'] : []
    }
  },
  SetCollectionsToSelection (state, { collections, bookmark }) {
    const currentIds = state.selectedCollections.map(sc => sc.value)
    const newCollections = collections.filter(cf => !currentIds.includes(cf.value))
    state.selectedCollections = state.selectedCollections.concat(newCollections)

    if (bookmark) {
      createBookmark(state.filters.selections, state.selectedCollections)
    }
  },
  SetSearchHistory (state, history) {
    if (history === '') {
      history = 'No filters used.'
    }

    // only add if this is a different query than before
    if (state.searchHistory.length && !state.searchHistory[state.searchHistory.length - 1] !== history) {
      state.searchHistory.push(history)
    } else {
      // we can safely write history here.
      state.searchHistory.push(history)
    }
  },
  RemoveCollectionsFromSelection (state, { collections, bookmark }) {
    const collectionsToRemove = collections.map(c => c.value)
    state.selectedCollections = state.selectedCollections.filter(sc => !collectionsToRemove.includes(sc.value))

    if (bookmark) {
      createBookmark(state.filters.selections, state.selectedCollections)
    }
  },
  /**
   *
   * @param state
   * @param params
   */
  MapQueryToState (state, ie11Query) {
    const query = ie11Query || state.route.query

    const keysInQuery = Object.keys(query)
    // we load the filterdefinitions, grab the names, so we can loop over it to map the selections
    const filters = filterDefinitions(state).map(fd => fd.name)
      .filter(name => keysInQuery.includes(name))
      .filter(fr => !['search', 'nToken'].includes(fr)) // remove specific filters, else we are doing them again.

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
      state.selectedCollections = cartIds.map(id => ({ label: state.collectionDictionary[id], value: id }))

      // add the beginning of history if from a link-back url
      if (state.searchHistory.length === 0) {
        state.searchHistory.push('Starting with a preselected list of collections')
      }
    }

    for (const filterName of filters) {
      if (query[filterName]) {
        let queryValues = decodeURIComponent(query[filterName]).split(',')
        // if it's not ORPHA it's ICD-10, then we have to add urn:miriam:icd: to make it an id
        // for backwards compatibility if it's not present
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
  },
  SetError (state, error) {
    state.error = error
  },
  SetLoading (state, loading) {
    state.isLoading = loading
  },
  SetPodium (state, response) {
    state.isPodium = response.items.map(item => item.id.toLowerCase()).some(id => id.includes('podium'))
  },
  SetPodiumCollections (state, response) {
    state.podiumCollectionIds = response.items.map(pc => pc.data.id)
  },
  SetNegotiatorEntities (state, negotiatorConfig) {
    const negotiatorEntities = negotiatorConfig.items.map(nci => {
      return { id: nci.id, collectionEntityId: nci.entity.id, biobankEntityId: nci.biobankId.refEntityType.id } // We need to have the table
    }).filter(ne => negotiatorConfigIds.includes(ne.id))[0]

    if (negotiatorEntities) {
      state.negotiatorCollectionEntityId = negotiatorEntities.collectionEntityId
      state.negotiatorBiobankEntityId = negotiatorEntities.biobankEntityId
    }
  }
}
