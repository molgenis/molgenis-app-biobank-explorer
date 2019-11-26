import { getUniqueIdArray } from '../utils'
import { fixCollectionTree } from './helpers'

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

export const UPDATE_FILTER = '__UPDATE_FILTER__'
export const RESET_FILTERS = '__RESET_FILTERS__'

export const SET_ALL_BIOBANKS = '__SET_ALL_BIOBANKS__'
export const SET_COLLECTION_IDS = '__SET_COLLECTION_IDS__'
export const SET_BIOBANK_REPORT = '__SET_BIOBANK_REPORT__'
export const SET_COLLECTION_REPORT = '__SET_COLLECTION_REPORT__'
export const SET_NETWORK_REPORT = '__SET_NETWORK_REPORT__'

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
  },
  [SET_ALL_BIOBANKS] (state, biobanks) {
    state.allBiobanks = biobanks.map(fixCollectionTree)
  },
  [SET_COLLECTION_IDS] (state, collectionIds) {
    state.collectionIds = collectionIds
  },
  /**
   * Store a single biobank in the state for showing a biobank report
   * @param state
   * @param biobank response object from the server containing meta and items for a single biobank
   */
  [SET_BIOBANK_REPORT] (state, biobank) {
    state.biobankReport = {
      data: biobank.items[0],
      metadata: biobank.meta
    }
  },
  [SET_COLLECTION_REPORT] (state, collection) {
    state.collectionReport = collection
  },
  [SET_NETWORK_REPORT] (state, network) {
    state.networkReport = network
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
