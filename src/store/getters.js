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
   * Get biobanks filtered by the free text search parameter.
   * With no filter present, return all biobanks
   *
   * If the hide empty collection box is checked, filter out all the biobanks with empty collections
   */
  getBiobanksFilteredWithSearch: state => state.filterEmptyCollections ? state.biobanks.filter(biobank => biobank.collections.length > 0) : state.biobanks,
  /**
   * Gets a complete query object used in the vue-router URL
   *
   * will provide an object like so:
   * query = {
   *  search: String,
   *  countries: Array<String>,
   *  materialTypes: Array<String>,
   *  quality: Array<String>,
   *  diseaseTypes: Array<String>
   * }
   *
   * Do not add token, because we send the token in the Negotiator request
   *
   * @param state
   * @returns Query object
   */
  getRouteQueryParams: state => {
    const search = state.search
    const country = state.country.filters
    const materials = state.materials.filters
    const standards = state.standards.filters
    const diseases = state.diagnosis_available.filters.map(filter => filter.id)

    let query = {}
    if (search !== '') query.search = search
    if (country.length > 0) query.country = country.join(',')
    if (materials.length > 0) query.materials = materials.join(',')
    if (standards.length > 0) query.standards = standards.join(',')
    if (diseases.length > 0) query.diagnosis_available = diseases.join(',')

    return query
  }
}
