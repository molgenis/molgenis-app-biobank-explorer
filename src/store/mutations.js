import { getUniqueIdArray } from '../utils'
import { fixCollectionTree } from './helpers'
import { covid19NetworkId, covid19BiobankNetworkSelectionId, covid19CollectionNetworkSelectionId } from './helpers/covid19Helper'
import Vue from 'vue'

export const SET_COUNTRIES = '__SET_COUNTRIES__'
export const SET_MATERIALS = '__SET_MATERIALS__'
export const SET_COLLECTION_QUALITY = '__SET_COLLECTION_QUALITY__'
export const SET_BIOBANK_QUALITY = '__SET_BIOBANK_QUALITY__'
export const SET_COLLECTION_TYPES = '__SET_COLLECTION_TYPES__'
export const SET_DATA_TYPES = '__SET_DATA_TYPES__'
export const SET_DIAGNOSIS_AVAILABLE = '__SET_DIAGNOSIS_AVAILABLE__'
export const SET_SEARCH = '__SET_SEARCH__'
export const SET_COLLECTION_QUALITY_COLLECTIONS = '__SET_COLLECTION_QUALITY_COLLECTIONS__'
export const SET_BIOBANK_QUALITY_BIOBANKS = '__SET_BIOBANK_QUALITY_BIOBANKS__'
export const SET_COVID_19 = '__SET_COVID_19__'

export const UPDATE_FILTER = '__UPDATE_FILTER__'
export const RESET_FILTERS = '__RESET_FILTERS__'

export const SET_BIOBANKS = '__SET_BIOBANKS__'
export const SET_BIOBANK_IDS = '__SET_BIOBANK_IDS__'
export const SET_COLLECTION_IDS = '__SET_COLLECTION_IDS__'
export const SET_COVID_19_NETWORK = '__SET_COVID_19_NETWORK__'
export const SET_BIOBANK_REPORT = '__SET_BIOBANK_REPORT__'
export const SET_COLLECTION_REPORT = '__SET_COLLECTION_REPORT__'
export const SET_NETWORK_REPORT = '__SET_NETWORK_REPORT__'

// these are not network, but networkreport
export const SET_NETWORK_COLLECTIONS = '__SET_NETWORK_COLLECTIONS__'
export const SET_NETWORK_BIOBANKS = '__SET_NETWORK_BIOBANKS__'

export const MAP_QUERY_TO_STATE = '__MAP_QUERY_TO_STATE__'

export const SET_ERROR = '__SET_ERROR__'
export const SET_LOADING = '__SET_LOADING__'

export const SET_LAST_URL = '__SET_LAST_URL__'

const combineCodeAndLabels = (diagnoses) => {
  return diagnoses.map(diagnosis => {
    diagnosis.originalLabel = diagnosis.label
    diagnosis.label = diagnosis.code + ' - ' + diagnosis.label
    return diagnosis
  })
}

const getUniqueFilterMatches = (filter, selector) => {
  const matches = filter.map((match) => { return match[selector].id })
  return getUniqueIdArray(matches)
}

const hasFilterWithoutMatches = (filter, matches) => {
  return filter.length && !matches.length
}

export default {
  /**
   * Update the options for the different filters available in the biobank explorer
   */
  [SET_COUNTRIES] (state, countries) {
    state.country.options = countries.map(country => ({...country, label: country.name}))
  },
  [SET_MATERIALS] (state, materials) {
    state.materials.options = materials
  },
  [SET_COLLECTION_QUALITY] (state, collectionQuality) {
    state.collection_quality.options = collectionQuality
  },
  [SET_BIOBANK_QUALITY] (state, biobankQuality) {
    state.biobank_quality.options = biobankQuality
  },
  [SET_COLLECTION_TYPES] (state, types) {
    state.type.options = types
  },
  [SET_DATA_TYPES] (state, dataTypes) {
    state.dataType.options = dataTypes
  },
  [SET_DIAGNOSIS_AVAILABLE] (state, diagnoses) {
    state.diagnosis_available.options = combineCodeAndLabels(diagnoses)
  },
  [SET_SEARCH] (state, search) {
    state.search = search
  },
  [SET_COLLECTION_QUALITY_COLLECTIONS] (state, collections) {
    state.collection_quality.collections = hasFilterWithoutMatches(state.collection_quality.filters, collections) ? ['invalid_collection'] : getUniqueFilterMatches(collections, 'collection')
  },
  [SET_BIOBANK_QUALITY_BIOBANKS] (state, biobanks) {
    state.biobank_quality.biobanks = hasFilterWithoutMatches(state.biobank_quality.filters, biobanks) ? ['invalid_biobank'] : getUniqueFilterMatches(biobanks, 'biobank')
  },
  [SET_COVID_19] (state, covid19) {
    state.covid19.options = covid19.map(covOption => { return { id: covOption.id, label: covOption.label || covOption.name } })
  },
  /**
   * Register the filters for country, materials, standards, and diagnosis_available in the state
   * so they can be used for 1) the URL and 2) retrieving biobanks based on IDs
   *
   * @param state
   * @param name name of the state entry e.g. country, materials, standards, or diagnosis_available
   * @param filters an array of values
   */
  [UPDATE_FILTER] (state, {name, filters}) {
    state[name].filters = filters
  },
  /**
   * Reset all filters in the state
   */
  [RESET_FILTERS] (state) {
    state.diagnosis_available.filters = []
    state.materials.filters = []
    state.country.filters = []
    state.collection_quality.filters = []
    state.collection_quality.collections = []
    state.biobank_quality.filters = []
    state.biobank_quality.biobanks = []
    state.type.filters = []
    state.dataType.filters = []
    state.covid19.filters = []
    state.covid19network.filters = []
  },
  [SET_BIOBANKS] (state, biobanks) {
    biobanks.forEach(biobank => {
      Vue.set(state.biobanks, biobank.id, fixCollectionTree(biobank))
    })
  },
  [SET_BIOBANK_IDS] (state, biobankIds) {
    state.biobankIds = biobankIds
  },
  [SET_COLLECTION_IDS] (state, collectionIds) {
    state.collectionIds = collectionIds
  },
  [SET_COVID_19_NETWORK] (state, covid19FacetSelectionIds) {
    const biobankNetwork = state.biobank_network.filters
    const collectionNetwork = state.collection_network.filters

    // check if biobank network was selected and not already on the state.
    if (covid19FacetSelectionIds.includes(covid19BiobankNetworkSelectionId) && !biobankNetwork.includes(covid19NetworkId)) {
      Vue.set(state.biobank_network, 'filters', [...biobankNetwork, covid19NetworkId])
    } else { // we don't have biobank selected and we have one present in biobank network filter, so remove
      biobankNetwork.splice(biobankNetwork.indexOf(covid19NetworkId), 1)
      Vue.set(state.biobank_network, 'filters', biobankNetwork)
    }

    if (covid19FacetSelectionIds.includes(covid19CollectionNetworkSelectionId) && !collectionNetwork.includes(covid19NetworkId)) {
      Vue.set(state.collection_network, 'filters', [...collectionNetwork, covid19NetworkId])
    } else {
      collectionNetwork.splice(collectionNetwork.indexOf(covid19NetworkId), 1)
      Vue.set(state.collection_network, 'filters', collectionNetwork)
    }
  },
  /**
   * Store a single biobank in the state for showing a biobank report
   * @param state
   * @param biobank response object from the server containing meta and items for a single biobank
   */
  [SET_BIOBANK_REPORT] (state, biobank) {
    state.biobankReport = biobank
  },
  [SET_COLLECTION_REPORT] (state, collection) {
    state.collectionReport = collection
  },
  [SET_NETWORK_REPORT] (state, network) {
    state.networkReport.network = network
  },
  [SET_NETWORK_COLLECTIONS] (state, collections) {
    state.networkReport.collections = collections
  },
  [SET_NETWORK_BIOBANKS] (state, biobanks) {
    state.networkReport.biobanks = biobanks
  },
  /**
   *
   * @param state
   * @param params
   */
  [MAP_QUERY_TO_STATE] (state, params) {
    const query = state.route.query

    if (params && params.diagnoses) {
      state.diagnosis_available.filters = combineCodeAndLabels(params.diagnoses)
    }

    if (query.collection_quality) {
      state.collection_quality.filters = query.collection_quality.split(',')
    }

    if (query.search) {
      state.search = query.search
    }

    if (query.country) {
      state.country.filters = query.country.split(',')
    }

    if (query.materials) {
      state.materials.filters = query.materials.split(',')
    }

    if (query.collection_quality) {
      state.collection_quality.filters = query.collection_quality.split(',')
    }

    if (query.type) {
      state.type.filters = query.type.split(',')
    }

    if (query.dataType) {
      state.dataType.filters = query.dataType.split(',')
    }

    if (query.covid19) {
      state.covid19.filters = query.covid19.split(',')
    }

    if (query.covid19network) {
      state.covid19network.filters = query.covid19network.split(',')
    }

    if (query.nToken) {
      state.nToken = query.nToken
    }
  },
  [SET_ERROR] (state, error) {
    state.error = error
  },
  [SET_LOADING] (state, loading) {
    state.isLoading = loading
  }
}
