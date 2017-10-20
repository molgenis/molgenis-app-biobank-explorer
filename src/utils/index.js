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

export default {
  filterToQueryPart,
  queryPartsToQuery
}
