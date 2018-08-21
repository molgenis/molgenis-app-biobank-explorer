/**
 * Create an RSQL 'in' query for filters
 *
 * @example in query for country filter
 * country=in=(NL,BE,DE)
 */
export const createInQuery = (attribute, filters) => filters.length > 0
  ? [{selector: attribute, comparison: '=in=', arguments: filters}]
  : []

/**
 * Return an Array of unique identifiers
 *
 * @param list List of strings
 * @returns Array containing unique string values
 */
export const getUniqueIdArray = (list) => {
  return Array.from(new Set(list))
}

/**
 * Return an Array of Filter IDs without the selectedFilterId
 */
export const removeFilterFromFilterArrayById = (filters, selectedFilterId) => {
  return filters.filter(filter => filter.id !== selectedFilterId).map(filter => filter.id)
}

export default {
  getUniqueIdArray,
  createInQuery,
  removeFilterFromFilterArrayById
}
