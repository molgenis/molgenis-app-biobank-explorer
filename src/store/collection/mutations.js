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
  }
}
