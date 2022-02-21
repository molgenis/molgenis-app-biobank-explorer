import { createBookmark } from '../../utils/bookmarkMapper'

export const collectionMutations = {
  SetAllCollectionRelationData (state, response) {
    const collectionRelationData = response.items.map(item => ({
      collectionId: item.data.id,
      collectionName: item.data.label || item.data.name,
      biobankId: item.data.biobank.data.id,
      biobankName: item.data.biobank.data.label || item.data.biobank.data.name,
      isSubcollection: item.data.parent_collection !== undefined,
      parentCollection: item.data.parent_collection,
      commercialUse: item.data.collaboration_commercial
    }))

    const nonCommercialUseCollections = []
    const collectionBiobankDictionary = {}
    const collectionNameDictionary = {}

    collectionRelationData.forEach(function (collectionRelationEntry) {
      collectionBiobankDictionary[collectionRelationEntry.collectionId] = collectionRelationEntry.biobankName
      collectionNameDictionary[collectionRelationEntry.collectionId] = collectionRelationEntry.collectionName

      if (!collectionRelationEntry.commercialUse) {
        nonCommercialUseCollections.push(collectionRelationEntry.collectionId)
      }
    })

    state.collectionBiobankDictionary = collectionBiobankDictionary
    state.collectionNameDictionary = collectionNameDictionary
    state.nonCommercialCollections = nonCommercialUseCollections
    state.collectionRelationData = collectionRelationData
  },
  SetCollectionInfo (state, response) {
    if (response === undefined) {
      state.collectionInfo = response
      return
    }

    const collectionIds = response.items.map(item => item.data.id)
    const collectionInfo = []
    state.collectionRelationData.forEach((collection) => {
      if (collectionIds.includes(collection.collectionId)) {
        collectionInfo.push(collection)
      }
    })

    state.collectionInfo = collectionInfo
  },

  SetCollectionReport (state, collection) {
    state.collectionReport = collection
  },
  // methods for rehydrating bookmark
  SetCollectionIdsWithSelectedQuality (state, response) {
    if (response.items && response.items.length > 0) {
      state.collectionIdsWithSelectedQuality = []
      state.collectionIdsWithSelectedQuality = [...new Set(response.items.map(ri => ri.collection.id))]
    } else {
      const collectionQualityFilter = state.filters.selections.collection_quality
      const isCollectionQualityFilterActive = (collectionQualityFilter && collectionQualityFilter.length > 0) || state.route.query.collection_quality

      state.collectionIdsWithSelectedQuality = isCollectionQualityFilterActive ? ['no-collection-found'] : []
    }
  },
  SetCollectionsToSelection (state, { collections, bookmark }) {
    state.cartValid = false
    const currentIds = state.selectedCollections.map(sc => sc.value)
    const newCollections = collections.filter(cf => !currentIds.includes(cf.value))
    state.selectedCollections = state.selectedCollections.concat(newCollections)

    if (bookmark) {
      state.cartValid = true
      createBookmark(state.filters.selections, state.selectedCollections)
    }
  },
  RemoveCollectionsFromSelection (state, { collections, bookmark }) {
    state.cartValid = false
    const collectionsToRemove = collections.map(c => c.value)
    state.selectedCollections = state.selectedCollections.filter(sc => !collectionsToRemove.includes(sc.value))

    if (bookmark) {
      state.cartValid = true
      createBookmark(state.filters.selections, state.selectedCollections)
    }
  },
  SetPodiumCollections (state, response) {
    state.podiumCollectionIds = response.items.map(pc => pc.data.id)
  }
}
