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
  // /**
  //  * Gets a complete query object used in the vue-router URL
  //  *
  //  * will provide an object like so:
  //  * query = {
  //  *  search: String,
  //  *  countries: Array<String>,
  //  *  materialTypes: Array<String>,
  //  *  quality: Array<String>,
  //  *  diseaseTypes: Array<String>
  //  * }
  //  *
  //  * Do not add token, because we send the token in the Negotiator request
  //  *
  //  * @param state
  //  * @returns Query object
  //  */
  // getCompleteQuery:
  //   state => {
  //     const search = state.search
  //     const countries = state.filters.countries.selectedOptions
  //     const materialTypes = state.filters.material_types.selectedOptions
  //     const quality = state.filters.quality.selectedOptions
  //     const diseaseTypes = state.filters.disease_types.selectedOptions.map(option => option.id)
  //
  //     let query = {}
  //     if (search !== '') query.search = search
  //     if (countries.length > 0) query.countries = countries.join(',')
  //     if (materialTypes.length > 0) query.materialTypes = materialTypes.join(',')
  //     if (quality.length > 0) query.quality = quality.join(',')
  //     if (diseaseTypes.length > 0) query.diseaseTypes = diseaseTypes.join(',')
  //
  //     return query
  //   },
  /**
   * Get loading boolean for showing spinners
   * @param state
   */
  getLoading:
    state => state.loading
}
