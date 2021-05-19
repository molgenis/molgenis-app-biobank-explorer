import { INITIAL_STATE } from '../store/state'
/**
 * Generate the attribute selector for quality parameters (can be either for collection or for biobank)
 * */
const qualityAttributeSelector = (type) => {
  return `quality(id,standards(*),assess_level_${type}(*),certification_number,certification_image_link,certification_report,label)`
}

const hasAggregateCode = /[A-Z]{1}\d{1,2}\.?\d+?-[A-Z]{1}\d{1,2}\.?\d+?$/gm

export const queryBuilder = (attribute, filters, comparison) => filters.length > 0
  ? [{ selector: attribute, comparison, arguments: filters }]
  : []

/**
 * Create an RSQL 'in' query for filters
 *
 * @example in query for country filter
 * country=in=(NL,BE,DE)
 */
export const createInQuery = (attribute, filters) => filters.length > 0
  ? queryBuilder(attribute, filters, '=in=')
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
  if (filterSelection && filterSelection.length && satisfyAll) {
    return {
      operator: 'AND',
      operands: createComparisons(columnName, filterSelection || [])
    }
  } else { return createInQuery(columnName, filterSelection || []) }
}

/**
 * Some specific cases have a id with a code that is a combination of codes
 * e.g. c15-c26 is everything between c15 and c26, but this is handled in molgenis.
 */
export const diagnosisAvailableQuery = (filterSelection, columnName, satisfyAll) => {
  if (!filterSelection || !filterSelection.length) return [] // nothing to filter

  const codeIds = filterSelection.filter(code => !code.match(hasAggregateCode))
  const aggregateCodeIds = filterSelection.filter(code => code.match(hasAggregateCode))

  let query, aggregateCodeQuery

  if (codeIds.length) {
    query = satisfyAll ? createComparisons(columnName, codeIds) : createInQuery(columnName, codeIds)
  }

  // treat this separately, because this is treated special in the backend.
  if (aggregateCodeIds.length) {
    aggregateCodeQuery = createInQuery('diagnosis_available', aggregateCodeIds)
  }

  const rsqlQuery = {
    operator: satisfyAll ? 'AND' : 'OR',
    operands: []
  }

  if (query) {
    rsqlQuery.operands = rsqlQuery.operands.concat(query)
  }
  if (aggregateCodeQuery) {
    rsqlQuery.operands = rsqlQuery.operands.concat(aggregateCodeQuery)
  }

  return rsqlQuery
}

export const arrayEqual = (a, b) => {
  return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((val, index) => val === b[index])
}

export default {
  getUniqueIdArray,
  createInQuery,
  createComparisons,
  diagnosisAvailableQuery,
  removeFilterFromFilterArrayById,
  qualityAttributeSelector,
  getBaseUrl,
  arrayEqual
}
