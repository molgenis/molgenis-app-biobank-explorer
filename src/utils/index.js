import { INITIAL_STATE } from '../store/state'
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

/**
 * Return the whole base url comprising protocol, host, and base path of the application.
 */
export const getBaseUrl = () => {
  const baseUrl = INITIAL_STATE.baseUrl || ''
  return `${window.location.protocol}//${window.location.host}${baseUrl}/#`
}

/** Creates the query string portion according to filter selection and satisfyAll parameter. If the satisfyAll parameter
 * is set to true, and AND query is created; else, an OR query is created, (with the usage of the in clause)
 *
 * @param filterSelection The list of filter items selections, as ['IT', 'NL'] for country filter
 * @param columnName The name of the filter column in the database
 * @returns The RSQL string portion matching an AND or OR query for the filter parameters: for the selections above, it returns
 * 'country==IT;country==NL' if the satisfyAll parameter is set to true; else, it returns 'country=in=(IT,NL)'
 */
export const createQuery = (filterSelection, columnName, satisfyAll) => {
  if (filterSelection && satisfyAll) {
    return {
      operator: 'AND',
      operands: createComparisons(columnName, filterSelection || [])
    }
  } else { return createInQuery(columnName, filterSelection || []) }
}

export default {
  getUniqueIdArray,
  createInQuery,
  createComparisons,
  removeFilterFromFilterArrayById,
  qualityAttributeSelector,
  getBaseUrl
}
