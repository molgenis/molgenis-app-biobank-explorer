import { createRSQLQuery, createBiobankRSQLQuery, filterCollectionTree } from './helpers'
import { groupCollectionsByBiobankId } from '../utils/grouping'
import filterDefinitions from '../utils/filterDefinitions'

export default {
  filterDefinitions,
  loading: ({ collectionInfo, biobankIds }) => !(biobankIds && collectionInfo),
  biobanks: ({ collectionInfo, biobankIds, biobanks }, { loading, rsql }) => {
    if (loading) {
      return []
    }
    let ids = biobankIds
    if (rsql && rsql.length) {
      ids = collectionInfo
      // biobank IDs present in collectionIds
        .map(({ biobankId }) => biobankId)
      // also present in biobankIds
        .filter(biobankId => biobankIds.includes(biobankId))
      // first occurrence of ID only
        .filter((value, index, self) => self.indexOf(value) === index)
    }
    return ids.map(biobankId => {
      if (!Object.prototype.hasOwnProperty.call(biobanks, biobankId)) {
        return biobankId
      }
      const biobank = biobanks[biobankId]
      return {
        ...biobank,
        collections: filterCollectionTree(collectionInfo.map(it => it.collectionId), biobank.collections)
      }
    })
  },
  getFoundBiobankIds: (_, { biobanks }) => biobanks.map(b => b.id || b).filter(bid => bid !== undefined),
  getCollectionsWithBiobankId: (state) => {
    if (state.collectionInfo) {
      return state.collectionInfo.map(colInfo => {
        return {
          collectionId: colInfo.collectionId,
          biobankId: colInfo.biobankId
        }
      })
    }
  },
  foundBiobanks: (_, { biobanks }) => {
    return biobanks.length
  },
  foundCollectionIds (_, { getFoundBiobankIds, getCollectionsWithBiobankId }) {
    // only if there are biobanks, then there are collections. we can't have rogue collections :)
    if (getFoundBiobankIds.length && getCollectionsWithBiobankId.length) {
      const biobanksWithCollections = groupCollectionsByBiobankId(getCollectionsWithBiobankId)
      let collectionIds = []
      for (const id of getFoundBiobankIds) {
        const collectionsInBiobank = biobanksWithCollections[id]
        if (collectionsInBiobank) collectionIds = collectionIds.concat(collectionsInBiobank)
      }
      return collectionIds
    }
    return []
  },
  collectionsInPodium ({ podiumCollectionIds, collectionInfo, isPodium }, { foundCollectionIds }) {
    if (isPodium && podiumCollectionIds && collectionInfo && foundCollectionIds) {
      const collectionInfoInSelection = collectionInfo.filter(colInfo => foundCollectionIds.includes(colInfo.collectionId))
      const collectionNames = collectionInfoInSelection.filter(colInfo => podiumCollectionIds
        .includes(colInfo.collectionId))
        .map(podCols => podCols.collectionName) // Returns only collection names.
      return collectionNames
    } else return []
  },
  selectedBiobankQuality: state => state.filters.selections.biobank_quality,
  selectedCollectionQuality: state => {
    return state.filters.selections.collection_quality
  },
  rsql: createRSQLQuery,
  biobankRsql: createBiobankRSQLQuery,
  resetPage: state => !state.isPaginating,
  showCountryFacet: state => state.showCountryFacet,
  /**
   * Get map of active filters
   */
  getActiveFilters: state => state.filters.selections,
  getErrorMessage: state => {
    if (!state.error) {
      return undefined
    }
    if (state.error.errors) {
      return state.error.errors[0].message
    }
    if (state.error.message) {
      return state.error.message
    }
    return 'Something went wrong'
  }
}
