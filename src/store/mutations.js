import Vue from 'vue'
import { createBookmark } from '../utils/bookmarkMapper'
import { fixCollectionTree } from './helpers'
import filterDefinitions from '../utils/filterDefinitions'
import { covid19NetworkId, covid19BiobankNetworkSelectionId, covid19CollectionNetworkSelectionId } from './helpers/covid19Helper'

const negotiatorConfigIds = ['directory', 'bbmri-eric-model']

export default {
  /**
   * Register the filters for country, materials, standards, and diagnosis_available in the state
   * so they can be used for 1) the URL and 2) retrieving biobanks based on IDs
   *
   * @param state
   * @param name name of the state entry e.g. country, materials, standards, or diagnosis_available
   * @param filters an array of values
   */
  UpdateFilter (state, { name, value, router }) {
    Vue.set(state.filters.selections, name, value)
    createBookmark(router, state.filters.selections)
  },
  UpdateAllFilters (state, selections) {
    state.filters.selections = {}
    for (const [key, value] of Object.entries(selections)) {
      Vue.set(state.filters.selections, key, value)
    }
  },
  /**
   * Reset all filters in the state
   */
  ResetFilters (state) {
    state.filters.selections = {}
  },
  SetBiobanks (state, biobanks) {
    biobanks.forEach(biobank => {
      Vue.set(state.biobanks, biobank.id, fixCollectionTree(biobank))
    })
  },
  SetBiobankIds (state, biobankIds) {
    state.biobankIds = biobankIds
  },
  SetCollectionInfo (state, collectionInfo) {
    state.collectionInfo = collectionInfo
  },
  SetCovid19Network (state, covid19FacetSelectionIds) {
    const biobankNetwork = state.biobank_network.filters
    const collectionNetwork = state.collection_network.filters
    const addForBiobank = covid19FacetSelectionIds.includes(covid19BiobankNetworkSelectionId)
    const addForNetwork = covid19FacetSelectionIds.includes(covid19CollectionNetworkSelectionId)

    // clear state
    if (biobankNetwork.includes(covid19NetworkId)) biobankNetwork.splice(biobankNetwork.indexOf(covid19NetworkId), 1)
    if (collectionNetwork.includes(covid19NetworkId)) collectionNetwork.splice(collectionNetwork.indexOf(covid19NetworkId), 1)

    if (addForBiobank) Vue.set(state.biobank_network, 'filters', [...biobankNetwork, covid19NetworkId])
    else Vue.set(state.biobank_network, 'filters', biobankNetwork)

    if (addForNetwork) Vue.set(state.collection_network, 'filters', [...collectionNetwork, covid19NetworkId])
    else Vue.set(state.collection_network, 'filters', collectionNetwork)
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
  /**
   *
   * @param state
   * @param params
   */
  MapQueryToState (state) {
    const query = state.route.query
    const keysInQuery = Object.keys(query)
    // we load the filterdefinitions, grab the names, so we can loop over it to map the selections
    const filters = filterDefinitions(state).map(fd => fd.name).filter(name => keysInQuery.includes(name))

    if (query.search) {
      Vue.set(state.filters.selections, 'search', query.search)
    }

    if (query.nToken) {
      state.nToken = query.nToken
    }

    for (const filterName of filters) {
      if (query[filterName]) {
        Vue.set(state.filters.selections, filterName, query[filterName].split(','))
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
