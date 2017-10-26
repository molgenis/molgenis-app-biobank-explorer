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
  getDiagnosisAvailableOptions: state => state.diagnosis_available.options
}
