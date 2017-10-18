export const SET_BIOBANKS = '__SET_BIOBANKS__'
export const SET_COUNTRIES = '__SET_COUNTRIES__'
export const SET_MATERIAL_TYPES = '__SET_MATERIAL_TYPES__'
export const SET_QUALITY = '__SET_QUALITY__'
export const SET_DISEASE_TYPES = '__SET_DISEASE_TYPES__'
export const SET_FILTER = '__SET_FILTER__'
export const SET_ERROR = '__SET_ERROR__'
export const SET_SEARCH = '__SET_SEARCH__'
export const MAP_QUERY_TO_STATE = '__MAP_QUERY_TO_STATE__'
export const SET_LOADING = '__SET_LOADING__'

export default {
  [SET_BIOBANKS] (state, biobanks) {
    state.biobanks = biobanks
  },
  [SET_COUNTRIES] (state, countries) {
    state.filters.countries.options = countries
  },
  [SET_MATERIAL_TYPES] (state, materialTypes) {
    state.filters.material_types.options = materialTypes
  },
  [SET_QUALITY] (state, quality) {
    state.filters.quality.options = quality
  },
  [SET_DISEASE_TYPES] (state, diseaseTypes) {
    state.filters.disease_types.options = diseaseTypes
  },
  [SET_FILTER] (state, {name, newSelectedOptions}) {
    state.filters[name].selectedOptions = newSelectedOptions
  },
  [SET_ERROR] (state, error) {
    state.error = error
  },
  [SET_SEARCH] (state, search) {
    state.search = search
  },
  [MAP_QUERY_TO_STATE] (state, query) {
    if (query.search) state.search = query.search
    if (query.countries) state.filters.countries.selectedOptions = query.countries.split(',')
    if (query.materialTypes) state.filters.material_types.selectedOptions = query.materialTypes.split(',')
    if (query.quality) state.filters.quality.selectedOptions = query.quality.split(',')
    if (query.diseaseTypes) state.filters.disease_types.selectedOptions = query.diseaseTypes.split(',')
    if (query.nToken) state.nToken = query.nToken
  },
  [SET_LOADING] (state, loading) {
    state.loading = loading
  }
}
