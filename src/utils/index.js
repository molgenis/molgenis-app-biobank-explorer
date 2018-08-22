/**
 * Generate the attribute selector for quality parameters (can be either for collection or for biobank)
 * */
const qualityAttributeSelector = (type) => {
  return `quality(id,standards(*),assess_level_${type}(*),certification_number,certification_image_link,certification_report,label)`
}

/**
 * Generate a syntactically correct RSQL query from a list of RSQL queries
 */
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
 * Create an RSQL 'in' query for filters
 *
 * @example in query for country filter
 * country=in=(NL,BE,DE)
 */
const createInQuery = (attribute, filters) => {
  return filters.length > 0 ? `${attribute}=in=(${filters.join(',')})` : ''
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

/**
 * Return an Array of Filter IDs without the selectedFilterId
 */
const removeFilterFromFilterArrayById = (filters, selectedFilterId) => {
  return filters.filter(filter => filter.id !== selectedFilterId).map(filter => filter.id)
}

export default {
  queryPartsToQuery,
  getUniqueIdArray,
  createInQuery,
  removeFilterFromFilterArrayById,
  qualityAttributeSelector
}
