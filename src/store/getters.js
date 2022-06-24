import { createRSQLQuery, createBiobankRSQLQuery, filterCollectionTree, getHumanReadableString } from './helpers'
import { groupCollectionsByBiobankId } from '../utils/grouping'
import { sortCollectionsByName } from '../utils/sorting'

export default {
  getHumanReadableString,
  uiText: (state) => {
    return state.i18n[state.language]
  },
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
      // first occurrence of ID only
        .filter((value, index, self) => self.indexOf(value) === index)
    }
    return ids.map(biobankId => {
      // lazy loading, return only the id, which will be fetched on demand
      if (!Object.prototype.hasOwnProperty.call(biobanks, biobankId)) {
        return biobankId
      }
      const biobank = biobanks[biobankId]
      return {
        ...biobank,
        collections: sortCollectionsByName(filterCollectionTree(collectionInfo.map(it => it.collectionId), biobank.collections))
      }
    })
  },
  parentCollections: (state, { biobankRsql }) => {
    let allParentCollections = state.collectionInfo.filter(colInfo => !colInfo.isSubcollection)
    let flattenedCollections = []
    /**  check if we have any search result, then all biobankIds will be available.
    * Else we can just use the initial state.
    */
    if (biobankRsql) {
      allParentCollections = allParentCollections.filter(parentCollection => state.biobankIds.includes(parentCollection.biobankId))
    }

    allParentCollections.forEach(function (apc) {
      flattenedCollections = flattenedCollections.concat(apc.collectionId)
    })
    return flattenedCollections
  },
  subcollections: (state, { biobankRsql }) => {
    let allSubcollections = state.collectionInfo.filter(colInfo => colInfo.isSubcollection)

    /**  check if we have any search result, then all biobankIds will be available.
    * Else we can just use the initial state.
    */
    if (biobankRsql) {
      allSubcollections = allSubcollections.filter(subCollection => state.biobankIds.includes(subCollection.biobankId))
    }

    let flattenedCollections = []
    allSubcollections.forEach(function (subCollection) {
      flattenedCollections = flattenedCollections.concat(subCollection)
    })
    return flattenedCollections
  },
  collectionBiobankDictionary: state => state.collectionBiobankDictionary,
  getFoundBiobankIds: (_, { biobanks }) => biobanks.map(b => b.id || b).filter(bid => bid !== undefined),
  foundBiobanks: (state) => {
    return state.biobankCount
  },
  foundCollectionIds (state, { getFoundBiobankIds }) {
    // only if there are biobanks, then there are collections. we can't have rogue collections :)
    if (getFoundBiobankIds.length && state.collectionInfo.length) {
      const biobanksWithCollections = groupCollectionsByBiobankId(state.collectionInfo)

      let collectionIds = []
      for (const id of getFoundBiobankIds) {
        const collectionsInBiobank = biobanksWithCollections[id]
        if (collectionsInBiobank) collectionIds = collectionIds.concat(collectionsInBiobank)
      }
      return collectionIds
    }
    return []
  },
  selectedNonCommercialCollections (state, { selectedCollections }) {
    const selectedNonCommercialCollections = selectedCollections.map(sc => sc.value).filter(sid => state.nonCommercialCollections.includes(sid))
    return selectedNonCommercialCollections.length
  },
  foundCollectionsAsSelection: (state, { parentCollections, foundCollectionIds }) => {
    const parentCollectionIds = foundCollectionIds.filter(fci => parentCollections.includes(fci))
    return parentCollectionIds.map(colId => ({ label: state.collectionNameDictionary[colId], value: colId }))
  },
  collectionsInPodium ({ podiumCollectionIds, collectionInfo, isPodium }, { foundCollectionIds, selectedCollections }) {
    if (isPodium && podiumCollectionIds && collectionInfo && foundCollectionIds) {
      const selectedCollectionIds = selectedCollections.map(sc => sc.value)
      const collectionInfoInSelection = collectionInfo.filter(colInfo => foundCollectionIds.includes(colInfo.collectionId))

      const collectionNames = collectionInfoInSelection.filter(colInfo => podiumCollectionIds
        .includes(colInfo.collectionId))
        .map(podCols => ({ label: podCols.collectionName, value: podCols.collectionId }))
        .filter(cn => selectedCollectionIds.includes(cn.value))

      return collectionNames
    } else return []
  },
  selectedCollections: state => state.selectedCollections,
  allCollectionsSelected: (_, { parentCollections, selectedCollections }) => {
    // if we don't have any selections present in our cart
    if (selectedCollections.length === 0) return false

    const selectedCollectionIds = selectedCollections.map(sc => sc.value)
    // parent collections are the collections currently shown based on filters, compared to the cart
    const allIdsPresentInSelection = parentCollections.every(cid => selectedCollectionIds.includes(cid))

    return allIdsPresentInSelection
  },
  selectedBiobankQuality: state => state.filters.selections.biobank_quality,
  selectedCollectionQuality: state => {
    return state.filters.selections.collection_quality
  },
  satisfyAllBiobankQuality: state => state.filters.satisfyAll.includes('biobank_quality'),
  satisfyAllCollectionQuality: state => state.filters.satisfyAll.includes('collection_quality'),
  rsql: createRSQLQuery,
  biobankRsql: createBiobankRSQLQuery,
  /**
   * Get map of active filters
   */
  activeFilters: state => state.filters.selections,
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
  },
  getNotificationMessage: state => state.notification
}
