export const sortCollectionsByName = function (collectionArray) {
  const newArray = [...new Set(collectionArray)] // remove the in place sorting

  return newArray.sort((a, b) => {
    if (a.name.toLowerCase() < b.name.toLowerCase()) {
      return -1
    }
    if (a.name.toLowerCase() > b.name.toLowerCase()) {
      return 1
    }
    return 0
  })
}
