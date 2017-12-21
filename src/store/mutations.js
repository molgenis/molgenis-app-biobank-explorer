export const SET_COUNTRIES = '__SET_COUNTRIES__'
export const SET_MATERIALS = '__SET_MATERIALS__'
export const SET_STANDARDS = '__SET_STANDARDS__'
export const SET_DIAGNOSIS_AVAILABLE = '__SET_DIAGNOSIS_AVAILABLE__'
export const SET_SEARCH = '__SET_SEARCH__'

export const UPDATE_FILTER = '__UPDATE_FILTER__'
export const RESET_FILTERS = '__RESET_FILTERS__'

export const SET_BIOBANKS = '__SET_BIOBANKS__'
export const SET_BIOBANK_REPORT = '__SET_BIOBANK_REPORT__'

export const MAP_QUERY_TO_STATE = '__MAP_QUERY_TO_STATE__'

export const SET_LOADING = '__SET_LOADING__'
export const SET_ERROR = '__SET_ERROR__'

const combineCodeAndLabels = (diagnoses) => {
  return diagnoses.map(diagnosis => {
    diagnosis.originalLabel = diagnosis.label
    diagnosis.label = diagnosis.code + ' - ' + diagnosis.label
    return diagnosis
  })
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
  [SET_STANDARDS] (state, standards) {
    state.standards.options = standards
  },
  [SET_DIAGNOSIS_AVAILABLE] (state, diagnoses) {
    state.diagnosis_available.options = combineCodeAndLabels(diagnoses)
  },
  [SET_SEARCH] (state, search) {
    state.search = search
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
    state.standards.filters = []
  },
  /**
   * Stores biobanks in the state. The list of biobanks is only overwritten when:
   *
   * 1) Any filter is changed
   * 2) A search query is submitted
   * 3) The page is refreshed
   */
  [SET_BIOBANKS] (state, biobanks) {
    state.biobanks = biobanks
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
  /**
   *
   * @param state
   * @param diagnoses
   */
  [MAP_QUERY_TO_STATE] (state, diagnoses) {
    const query = state.route.query

    if (diagnoses) {
      state.diagnosis_available.filters = combineCodeAndLabels(diagnoses)
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

    if (query.standards) {
      state.standards.filters = query.standards.split(',')
    }

    if (query.nToken) {
      state.nToken = query.nToken
    }
  },
  [SET_LOADING] (state, loading) {
    state.loading = loading
  },
  [SET_ERROR] (state, error) {
    state.error = error
  }
}
