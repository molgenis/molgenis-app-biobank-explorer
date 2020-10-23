import { getUniqueIdArray } from '../utils'
import { fixCollectionTree } from './helpers'
import { covid19NetworkFacetName, covid19NetworkId, covid19BiobankNetworkSelectionId, covid19CollectionNetworkSelectionId } from './helpers/covid19Helper'
import Vue from 'vue'

export const SET_COUNTRIES = '__SET_COUNTRIES__'
export const SET_MATERIALS = '__SET_MATERIALS__'
export const SET_COLLECTION_QUALITY = '__SET_COLLECTION_QUALITY__'
export const SET_BIOBANK_QUALITY = '__SET_BIOBANK_QUALITY__'
export const SET_COLLECTION_TYPES = '__SET_COLLECTION_TYPES__'
export const SET_DATA_TYPES = '__SET_DATA_TYPES__'
export const SET_DIAGNOSIS_AVAILABLE = '__SET_DIAGNOSIS_AVAILABLE__'
export const SET_SEARCH = '__SET_SEARCH__'
export const SET_NEGOTIATOR_ENTITIES = '__SET_NEGOTIATOR_ENTITIES__'
export const SET_COLLECTION_QUALITY_COLLECTIONS = '__SET_COLLECTION_QUALITY_COLLECTIONS__'
export const SET_BIOBANK_QUALITY_BIOBANKS = '__SET_BIOBANK_QUALITY_BIOBANKS__'
export const SET_COVID_19 = '__SET_COVID_19__'
export const SET_NETWORK_OPTIONS = '__SET_NETWORK_OPTIONS__'
export const SET_PODIUM_COLLECTIONS = '__SET_PODIUM_COLLECTIONS__'
export const UPDATE_FILTER = '__UPDATE_FILTER__'
export const RESET_FILTERS = '__RESET_FILTERS__'

export const SET_BIOBANKS = '__SET_BIOBANKS__'
export const SET_BIOBANK_IDS = '__SET_BIOBANK_IDS__'
export const SET_COLLECTION_INFO = '__SET_COLLECTION_INFO__'
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
export const SET_PODIUM = '__SET_PODIUM__'
export const SET_LAST_URL = '__SET_LAST_URL__'

const negotiatorConfigIds = ['directory', 'bbmri-eric-model']

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
    state.country.options = countries
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
    state.covid19.options = covid19
  },
  [SET_NETWORK_OPTIONS] (state, network) {
    const networkOptionsWithoutCovid19 = network.filter(network => network.id !== covid19NetworkId)
    state.biobank_network.options = networkOptionsWithoutCovid19
    state.collection_network.options = networkOptionsWithoutCovid19
  },
  /**
   * Register the filters for country, materials, standards, and diagnosis_available in the state
   * so they can be used for 1) the URL and 2) retrieving biobanks based on IDs
   *
   * @param state
   * @param name name of the state entry e.g. country, materials, standards, or diagnosis_available
   * @param filters an array of values
   */
  [UPDATE_FILTER] (state, { name, filters }) {
    if (name === covid19NetworkFacetName) this.commit(SET_COVID_19_NETWORK, filters)
    if (name === 'search') state.search = ''
    else {
      state[name].filters = filters
    }
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
    state.biobank_network.filters = []
    state.collection_network.filters = []
  },
  [SET_BIOBANKS] (state, biobanks) {
    biobanks.forEach(biobank => {
      Vue.set(state.biobanks, biobank.id, fixCollectionTree(biobank))
    })
  },
  [SET_BIOBANK_IDS] (state, biobankIds) {
    state.biobankIds = biobankIds
  },
  [SET_COLLECTION_INFO] (state, collectionInfo) {
    state.collectionInfo = collectionInfo
  },
  [SET_COVID_19_NETWORK] (state, covid19FacetSelectionIds) {
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

    if (query.type) {
      state.type.filters = query.type.split(',')
    }

    if (query.dataType) {
      state.dataType.filters = query.dataType.split(',')
    }

    if (query.covid19) {
      state.covid19.filters = query.covid19.split(',')
    }

    if (query.biobank_network) {
      state.biobank_network.filters = query.biobank_network.split(',')
    }

    if (query.biobank_quality) {
      state.biobank_quality.filters = query.biobank_quality.split(',')
    }

    if (query.collection_network) {
      state.collection_network.filters = query.collection_network.split(',')
    }

    if (query.covid19network) {
      const selectedCovid19NetworkIds = query.covid19network.split(',')
      state.covid19network.filters = selectedCovid19NetworkIds
      this.commit(SET_COVID_19_NETWORK, selectedCovid19NetworkIds)
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
  },
  [SET_PODIUM] (state, response) {
    state.isPodium = response.items.map(item => item.id.toLowerCase()).some(id => id.includes('podium'))
  },
  [SET_PODIUM_COLLECTIONS] (state, podiumCollections) {
    state.podiumCollectionIds = podiumCollections.map(pc => pc.data.id)
  },
  [SET_NEGOTIATOR_ENTITIES] (state, negotiatorConfig) {
    const negotiatorEntities = negotiatorConfig.items.map(nci => {
      return { id: nci.id, collectionEntityId: nci.entity.id, biobankEntityId: nci.biobankId.id }
    }).filter(ne => negotiatorConfigIds.includes(ne.id))[0]

    if (negotiatorEntities) {
      state.negotiatorCollectionEntityId = negotiatorEntities.collectionEntityId
      state.negotiatorBiobankEntityId = negotiatorEntities.biobankEntityId
    }
  }
}
