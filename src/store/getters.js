export default {
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
  getFilteredBiobanks: state => {
    if (state.biobanks) {
      let biobanks = state.biobanks.items

      const countryFilters = state.filters.countries.selectedOptions
      const materialTypeFilters = state.filters.material_types.selectedOptions
      const qualityFilters = state.filters.quality.selectedOptions

      if (countryFilters.length === 0 && materialTypeFilters.length === 0 && qualityFilters.length === 0) {
        return biobanks
      } else {
        if (countryFilters.length > 0) {
          biobanks = state.biobanks.items.filter(biobank => {
            return countryFilters.includes(biobank.country.id)
          })
        }

        if (materialTypeFilters.length === 0 && qualityFilters === 0) {
          return biobanks
        }

        if (materialTypeFilters.length > 0 || qualityFilters.length > 0) {
          biobanks = biobanks.filter(biobank => {
            const collections = biobank.collections

            const filteredCollections = collections.filter(collection => {
              const collectionsContainingMaterial = collection.materials.find(collectionMaterial => {
                return materialTypeFilters.includes(collectionMaterial.id)
              })

              const collectionsContainingQuality = collection.standards.find(collectionStandard => {
                return qualityFilters.includes(collectionStandard.id)
              })

              return (materialTypeFilters.length > 0 && qualityFilters.length === 0 && !!collectionsContainingMaterial) ||
                (materialTypeFilters.length === 0 && qualityFilters.length > 0 && !!collectionsContainingQuality) ||
                (!!collectionsContainingMaterial && !!collectionsContainingQuality)
            })
            return filteredCollections.length > 0
          })
        }
      }
      return biobanks
    } else {
      return {}
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
   *  quality: Array<String>
   * }
   *
   * @param state
   * @returns Query object
   */
  getCompleteQuery: state => {
    const search = state.search
    const countries = state.filters.countries.selectedOptions
    const materialTypes = state.filters.material_types.selectedOptions
    const quality = state.filters.quality.selectedOptions

    let query = {}
    if (search !== '') query.search = search
    if (countries.length > 0) query.countries = countries.join(',')
    if (materialTypes.length > 0) query.materialTypes = materialTypes.join(',')
    if (quality.length > 0) query.quality = quality.join(',')

    return query
  },
  /**
   * Get loading boolean for showing spinners
   * @param state
   */
  getLoading: state => state.loading
}
