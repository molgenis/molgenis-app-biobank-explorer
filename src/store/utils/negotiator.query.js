import getters from '../getters'

export const getHumanReadableString = (state) => {
  let humanReadableString = ''

  const countries = state.filters.countries
  const materialTypes = state.filters.material_types
  const quality = state.filters.quality

  if (state.search.length > 0) {
    humanReadableString += 'Free text search contains ' + state.search
  }

  if (countries.selectedOptions.length > 0) {
    if (humanReadableString.length > 0) humanReadableString += ' and '
    humanReadableString += 'selected countries are ' + countries.selectedOptions.join(',')
  }

  if (materialTypes.selectedOptions.length > 0) {
    if (humanReadableString.length > 0) humanReadableString += ' and '
    humanReadableString += 'selected material_types are ' + materialTypes.selectedOptions.join(',')
  }

  if (quality.selectedOptions.length > 0) {
    if (humanReadableString.length > 0) humanReadableString += ' and '
    humanReadableString += 'selected qualities are ' + quality.selectedOptions.join(',')
  }

  return humanReadableString
}

export const getFilteredCollections = (state) => {
  const biobanks = getters.getFilteredBiobanks(state)

  return biobanks.reduce((acc, biobank) => {
    const biobankId = biobank.id
    return acc.concat(biobank.collections.map(collection => {
      return {
        collectionId: collection.id,
        biobankId: biobankId
      }
    }))
  }, [])
}
