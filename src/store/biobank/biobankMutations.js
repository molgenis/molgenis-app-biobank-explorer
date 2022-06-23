
import { fixCollectionTree } from '../helpers'

export const biobankMutations = {
  SetBiobanks (state, biobanks) {
    const biobankLookup = {}

    biobanks.forEach(biobank => {
      biobankLookup[biobank.id] = fixCollectionTree(biobank)
    })
    state.biobanks = { ...state.biobanks, ...biobankLookup }
  },
  SetBiobankIds (state, biobankIds) {
    state.biobankIds = biobankIds
  },
  /**
   * Store a single biobank in the state for showing a biobank report
   * @param state
   * @param biobank response object from the server containing meta and items for a single biobank
   */
  SetBiobankReport (state, biobank) {
    state.biobankReport = biobank
  },
  SetBiobankCount (state, response) {
    /* Need to keep track of initial amount, because not all biobanks have collections */
    if (!state.initialBiobankCount) {
      state.initialBiobankCount = response.page.totalElements
      state.initialBiobankIds = response.items.map(item => item.data.id)
    }
    state.biobankCount = response.page.totalElements
  },
  CalculateBiobankCount (state, getters) {
    if (getters.biobankRsql) {
      // calculation has already been done.
    } else if (getters.rsql) {
      state.biobankCount = [...new Set(state.collectionInfo.map(collection => collection.biobankId))].length
    } else {
      state.biobankCount = state.initialBiobankCount
    }
  },
  SetBiobankIdsWithSelectedQuality (state, response) {
    if (response.items && response.items.length > 0) {
      state.biobankIdsWithSelectedQuality = []
      state.biobankIdsWithSelectedQuality = [...new Set(response.items.map(ri => ri.biobank.id))]
    } else {
      const biobankQualityFilter = state.filters.selections.biobank_quality
      const isBiobankQualityFilterActive = (biobankQualityFilter && biobankQualityFilter.length > 0) || state.route.query.biobank_quality

      state.biobankIdsWithSelectedQuality = isBiobankQualityFilterActive ? ['no-biobank-found'] : []
    }
  }
}
