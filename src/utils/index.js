/**
 * Generate the attribute selector for quality parameters (can be either for collection or for biobank)
 * */
const qualityAttributeSelector = (type) => {
  return `quality(id,standards(*),assess_level_${type}(*),certification_number,certification_image_link,certification_report,label)`
}

/**
 * Create an RSQL 'in' query for filters
 *
 * @example in query for country filter
 * country=in=(NL,BE,DE)
 */
export const createInQuery = (attribute, filters) => filters.length > 0
  ? [{ selector: attribute, comparison: '=in=', arguments: filters }]
  : []

/**
 * Create an array of == comparisons for each filter value
 */
export const createComparisons = (attribute, filters) =>
  filters.map(filterValue => ({ selector: attribute, comparison: '==', arguments: filterValue }))

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
  createComparisons,
  removeFilterFromFilterArrayById,
  qualityAttributeSelector
}

export const createQueryBlockForQualityIds = (qualityIds, columnName, operator) => {
  let query = ''
  for (let i = 0; i < qualityIds.length; i++) {
    query += columnName + '==' + qualityIds[i] + operator
  }
  const cleanedQuery = query.slice(0, -1)
  const embeddedCleanedQuery = '(' + cleanedQuery + ')'
  return embeddedCleanedQuery
}

export const createQueryParamOperandWithAndClause = (filterSelection, columnName, satisfyAll) => {
  if (filterSelection && satisfyAll) {
    return {
      operator: 'AND',
      operands: createComparisons(columnName, filterSelection || [])
    }
  } else { return createInQuery(columnName, filterSelection || []) }
}
