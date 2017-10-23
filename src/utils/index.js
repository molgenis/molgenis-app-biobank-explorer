const filterToQueryPart = (attribute, filters) => {
  return filters.reduce((accumulator, filter) => {
    if (accumulator.length > 0) {
      accumulator += ','
    }

    accumulator += attribute + '==' + filter
    return accumulator
  }, '')
}

const queryPartsToQuery = (queryParts) => {
  return queryParts.reduce((accumulator, queryPart) => {
    if (queryPart.length > 0) {
      if (accumulator.length > 0) {
        accumulator += ';'
      }
      accumulator += `(${queryPart})`
    }
    return accumulator
  }, '')
}

/**
 * Return an Array of unique identifiers
 *
 * @param list List of strings
 * @returns Array containing unique string values
 */
const getUniqueIdArray = (list) => {
  return Array.from(new Set(list))
}

export default {
  filterToQueryPart,
  queryPartsToQuery,
  getUniqueIdArray
}
