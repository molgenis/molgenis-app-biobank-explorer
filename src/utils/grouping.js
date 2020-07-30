export const groupCollectionsByBiobankId = function (collectionidWithBiobankId) {
  const collectionsPerBiobank = {}

  for (const collectionWithBiobank of collectionidWithBiobankId) {
    if (Object.prototype.hasOwnProperty.call(collectionsPerBiobank, collectionWithBiobank.biobankId)) {
      collectionsPerBiobank[collectionWithBiobank.biobankId].push(collectionWithBiobank.collectionId)
    } else {
      collectionsPerBiobank[collectionWithBiobank.biobankId] = [collectionWithBiobank.collectionId]
    }
  }
  return collectionsPerBiobank
}
