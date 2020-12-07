import { createRSQLQuery, createBiobankRSQLQuery, filterCollectionTree } from './helpers'
import { groupCollectionsByBiobankId } from '../utils/grouping'
import filterDefinitions from '../utils/filterDefinitions'

export default {
  filterDefinitions,
  bookmarkMappedToState: state => state.bookmarkMappedToState,
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
  parentCollections (_, { biobanks }) {
    if (biobanks && biobanks.length > 0 && typeof biobanks[0] !== 'string') {
      const allParentCollections = biobanks.map(biobank => biobank.collections.filter(collection => !collection.parent_collection).map(fc => fc.id))
      let flattenedCollections = []
      allParentCollections.forEach(function (apc) {
        flattenedCollections = flattenedCollections.concat(apc)
      })
      return flattenedCollections
    }
    return []
  },
  collectionBiobankDictionary: state => state.collectionBiobankDictionary,
  collectionDictionary: state => state.collectionDictionary,
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
  foundCollectionsAsSelection: (_, { parentCollections, foundCollectionIds, collectionDictionary }) => {
    const parentCollectionIds = foundCollectionIds.filter(fci => parentCollections.includes(fci))
    return parentCollectionIds.map(colId => ({ label: collectionDictionary[colId], value: colId }))
  },
  collectionsInPodium ({ podiumCollectionIds, collectionInfo, isPodium }, { foundCollectionIds }) {
    if (isPodium && podiumCollectionIds && collectionInfo && foundCollectionIds) {
      const collectionInfoInSelection = collectionInfo.filter(colInfo => foundCollectionIds.includes(colInfo.collectionId))
      const collectionNames = collectionInfoInSelection.filter(colInfo => podiumCollectionIds
        .includes(colInfo.collectionId))
        .map(podCols => ({ label: podCols.collectionName, value: podCols.collectionId }))
      return collectionNames
    } else return []
  },
  selectedCollections: state => state.selectedCollections,
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
