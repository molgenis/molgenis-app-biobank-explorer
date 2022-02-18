import Vue from 'vue'
import { fixCollectionTree } from '../helpers'

export const biobankMutations = {
  SetBiobanks (state, biobanks) {
    biobanks.forEach(biobank => {
      Vue.set(state.biobanks, biobank.id, fixCollectionTree(biobank))
    })
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
    if (getters.rsql) {
      state.biobankCount = [...new Set(state.collectionInfo.map(collection => collection.biobankId))].length
    } else {
      state.biobankCount = state.initialBiobankCount
    }
  }
}
