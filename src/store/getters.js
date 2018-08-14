export default {
  getCountryOptions: state => state.country.options,
  getMaterialOptions: state => state.materials.options,
  getStandardsOptions: state => state.standards.options,
  getTypesOptions: state => state.type.options,
  getDataTypeOptions: state => state.dataType.options,
  getDiagnosisAvailableOptions: state => state.diagnosis_available.options,
  /**
   * Get map of active filters
   */
  getActiveFilters: state => {
    const activeFilters = {}
    if (state.diagnosis_available.filters.length > 0) {
      activeFilters.diagnosis_available = state.diagnosis_available.filters
    }

    if (state.materials.filters.length > 0) {
      activeFilters.materials = state.materials.options.filter(option => state.materials.filters.includes(option.id))
    }

    if (state.country.filters.length > 0) {
      activeFilters.country = state.country.options.filter(option => state.country.filters.includes(option.id)).map(filter => {
        return {
          id: filter.id,
          label: filter.name
        }
      })
    }

    if (state.standards.filters.length > 0) {
      activeFilters.standards = state.standards.options.filter(option => state.standards.filters.includes(option.id))
    }

    if (state.type.filters.length > 0) {
      activeFilters.type = state.type.options.filter(option => state.type.filters.includes(option.id))
    }

    if (state.dataType.filters.length > 0) {
      activeFilters.dataType = state.dataType.options.filter(option => state.dataType.filters.includes(option.id))
    }

    return activeFilters
  }
}
