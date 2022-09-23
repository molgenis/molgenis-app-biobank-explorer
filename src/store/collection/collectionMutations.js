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

    /**  retrieve data from the 'cache' */
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
  SetCollectionsToSelection (state, { collections, bookmark }) {
    state.cartValid = false
    const currentIds = state.selectedCollections.map(sc => sc.value)
    const newCollections = collections.filter(cf => !currentIds.includes(cf.value))
    state.selectedCollections = state.selectedCollections.concat(newCollections)

    if (bookmark) {
      state.cartValid = true
      createBookmark(state.filters, state.selectedCollections)
    }
  },
  RemoveCollectionsFromSelection (state, { collections, bookmark }) {
    state.cartValid = false
    const collectionsToRemove = collections.map(c => c.value)
    state.selectedCollections = state.selectedCollections.filter(sc => !collectionsToRemove.includes(sc.value))

    if (bookmark) {
      state.cartValid = true
      createBookmark(state.filters, state.selectedCollections)
    }
  },
  SetPodiumCollections (state, response) {
    state.podiumCollectionIds = response.items.map(pc => pc.data.id)
  }
}
