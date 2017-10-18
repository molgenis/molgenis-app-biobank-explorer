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
   */
  getBiobanksFilteredWithSearch: state => state.biobanks,
  /**
   * Returns a biobank object based on the ID in the URL
   * @param state
   */
  getSelectedBiobank: state => state.biobanks && state.biobanks.items.find(biobank => biobank.id === state.route.params.id),
  /**
   *
   * @param state
   * @returns {Array}
   */
  getFilteredBiobanks:
    state => {
      if (state.biobanks) {
        let biobanks = state.biobanks.items

        const countryFilters = state.filters.countries.selectedOptions
        const materialTypeFilters = state.filters.material_types.selectedOptions
        const qualityFilters = state.filters.quality.selectedOptions
        const diseaseTypeFilters = state.filters.quality.selectedOptions.map(option => option.id)

        const countryFilterLength = countryFilters.length
        const materialTypeFilterLength = materialTypeFilters.length
        const qualityFilterLength = qualityFilters.length
        const diseaseTypeFilterLength = diseaseTypeFilters.length

        if (countryFilterLength === 0 && materialTypeFilterLength === 0 &&
          qualityFilterLength === 0 && diseaseTypeFilterLength === 0) {
          return biobanks
        } else {
          if (countryFilters.length > 0) {
            biobanks = state.biobanks.items.filter(biobank => {
              return countryFilters.includes(biobank.country.id)
            })
          }

          if (materialTypeFilterLength === 0 && qualityFilterLength === 0 && diseaseTypeFilterLength === 0) {
            return biobanks
          }

          if (materialTypeFilterLength > 0 || qualityFilterLength > 0 || diseaseTypeFilterLength > 0) {
            biobanks = biobanks.filter(biobank => {
              const collections = biobank.collections

              const filteredCollections = collections.filter(collection => {
                const collectionsContainingMaterial = collection.materials.find(collectionMaterial => {
                  return materialTypeFilters.includes(collectionMaterial.id)
                })

                const collectionsContainingQuality = collection.standards.find(collectionStandard => {
                  return qualityFilters.includes(collectionStandard.id)
                })

                const collectionsContainingDiseaseType = collection.diagnosis_available.find(collectionDiagnosis => {
                  return diseaseTypeFilters.includes(collectionDiagnosis.id)
                })

                return (materialTypeFilterLength > 0 && qualityFilterLength === 0 && diseaseTypeFilterLength === 0 && !!collectionsContainingMaterial) ||
                  (materialTypeFilterLength === 0 && qualityFilterLength > 0 && diseaseTypeFilterLength === 0 && !!collectionsContainingQuality) ||
                  (materialTypeFilterLength === 0 && qualityFilterLength === 0 && diseaseTypeFilterLength > 0 && !!collectionsContainingDiseaseType) ||
                  (!!collectionsContainingMaterial && !!collectionsContainingQuality && !!collectionsContainingDiseaseType)
              })
              return filteredCollections.length > 0
            })
          }
        }
        return biobanks
      } else {
        return []
      }
    },
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
  getCompleteQuery:
    state => {
      const search = state.search
      const countries = state.filters.countries.selectedOptions
      const materialTypes = state.filters.material_types.selectedOptions
      const quality = state.filters.quality.selectedOptions
      const diseaseTypes = state.filters.disease_types.selectedOptions.map(option => option.id)

      let query = {}
      if (search !== '') query.search = search
      if (countries.length > 0) query.countries = countries.join(',')
      if (materialTypes.length > 0) query.materialTypes = materialTypes.join(',')
      if (quality.length > 0) query.quality = quality.join(',')
      if (diseaseTypes.length > 0) query.diseaseTypes = diseaseTypes.join(',')

      return query
    },
  /**
   * Get loading boolean for showing spinners
   * @param state
   */
  getLoading:
    state => state.loading
}
