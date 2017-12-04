export default {
  /**
   * Get the option list for the country categorical filter
   */
  getCountryOptions: state => state.country.options,
  /**
   * Get the option list for the materials categorical filter
   */
  getMaterialOptions: state => state.materials.options,
  /**
   * Get the option list for the standards categorical filter
   */
  getStandardsOptions: state => state.standards.options,
  /**
   * Get the option list for the diagnosis available asynchronous xref filter
   */
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
    return activeFilters
  }
}
