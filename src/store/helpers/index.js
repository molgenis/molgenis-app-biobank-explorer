import { diagnosisAvailableQuery, createInQuery, createQuery, createLikeQuery } from '../../utils'
import { flatten } from 'lodash'
import { transformToRSQL } from '@molgenis/rsql'

export const isCodeRegex = /^(ORPHA|[A-Z]|[XVI]+):?(\d{0,2}(-([A-Z]\d{0,2})?|\.\d{0,3})?|\d+)?$/i

/**
 * @example queries
 * q=country.id=in=(NL,BE)
 * q=materials.id=in=(RNA,DNA)
 * q=diagnosis_available.code=in=(C18,L40)
 * q=standards.id=in=(cen-ts-16835-1-2015,cen-ts-16827-1-2015)
 */
export const createRSQLQuery = (state) => transformToRSQL({
  operator: 'AND',
  operands: flatten([
    // diagnosis_availabe uses a dynamic decorator to do automatic tree expansion. Therefor it MUST be on the column from collection itself.
    // And NOT on the column from the EntityType (table) it references to
    diagnosisAvailableQuery(state.filters.selections.diagnosis_available, 'diagnosis_available', state.filters.satisfyAll.includes('diagnosis_available')),
    createSearchInputQuery(state, ['name', 'id', 'acronym', 'diagnosis_available.id', 'diagnosis_available.code', 'diagnosis_available.label', 'diagnosis_available.ontology', 'materials.id', 'materials.label', 'biobank.name', 'biobank.id', 'biobank.acronym']),
    createRsqlQueriesFromState(state)
  ])
})

/**
 *
 * @param {*} state
 * @param {Array<string>} columns
 * @returns
 */
function createSearchInputQuery (state, columns) {
  const searchString = state.filters.selections.search

  if (!searchString) return []

  const queries = []

  for (const column of columns) {
    queries.push(createLikeQuery(column, searchString))
  }

  return [{
    operator: 'OR',
    operands: queries.flatMap(q => q)
  }]
}

function createRsqlQueriesFromState (state) {
  const hardcodedFilters = ['search', 'diagnosis_available']

  const activeFilterSelection = Object.keys(state.filters.selections).filter(selection => !hardcodedFilters.includes(selection))

  const queries = []

  for (const facet of state.filterFacets) {
    if (activeFilterSelection.includes(facet.name) && facet.applyTo.includes('eu_bbmri_eric_collections')) {
      queries.push(createQuery(state.filters.selections[facet.name], facet.columnName, state.filters.satisfyAll.includes(facet.name)))
    }
  }

  return flatten(queries)
}

export const createBiobankRSQLQuery = (state) => transformToRSQL({
  operator: 'AND',
  operands: flatten([
    createInQuery('country', state.filters.selections.country || []),
    createInQuery('id', state.biobankIdsWithSelectedQuality),
    createQuery(state.filters.selections.biobank_capabilities, 'capabilities', state.filters.satisfyAll.includes('biobank_capabilities'))
  ])
})

const createNegotiatorQueryBody = (state, getters, url) => {
  const result = {
    /* Remove the nToken from the URL to prevent duplication on the negotiator side when a query is edited more than once */
    URL: url.replace(/&nToken=\w{32}/, ''),
    entityId: state.negotiatorCollectionEntityId,
    humanReadable: createHistoryJournal(state),
    nToken: state.nToken
  }

  const collections = state.isPodium ? getters.collectionsInPodium : getters.selectedCollections
  result.rsql = transformToRSQL({ operator: 'AND', operands: createInQuery('id', collections.map(sc => sc.value)) })

  return result
}

function createHistoryJournal (state) {
  let journal = ''

  for (let i = 0, length = state.searchHistory.length; i < length; i++) {
    journal += `#${i + 1}: ${state.searchHistory[i]}\r\n`
  }
  return journal.substr(0, journal.length - 2) // remove the last \r\n
}

export const getHumanReadableString = (state) => {
  const activeFilters = Object.keys(state.filters.selections)
  let humanReadableString = ''
  const additionText = ' and '

  const filterLabels = state.filters.labels
  const humanReadableStart = {}

  // Get all the filterdefinitions for current active filters and make a dictionary name: humanreadable
  state.filterFacets.filter(fd => activeFilters.includes(fd.name))
    .forEach(filterDefinition => { humanReadableStart[filterDefinition.name] = filterDefinition.humanReadableString })

  // Extract filternames for which we have the labels for
  const labelsForFilters = Object.keys(filterLabels)

  // loop over the selection object and get all the keys which correspond to filtername
  for (const activeFilter in state.filters.selections) {
    // check if we already have labels
    if (!labelsForFilters.includes(activeFilter)) {
      // Get the selection values (ids)
      const selectedValues = state.filters.selections[activeFilter]

      // Grab the options from the cache that we have selected
      if (state.filterOptionDictionary[activeFilter]) {
        const cachedFilterOptions = state.filterOptionDictionary[activeFilter].filter(option => selectedValues.includes(option.value))

        const optionTexts = []
        for (const cachedOption of cachedFilterOptions) {
          optionTexts.push(cachedOption.text)
        }
        filterLabels[activeFilter] = optionTexts
      }
    }
  }

  for (const [filterName, filterValue] of Object.entries(state.filters.selections)) {
    if (!filterValue) continue

    humanReadableString += humanReadableStart[filterName]

    if (filterName === 'search') {
      humanReadableString += ` ${filterValue}`
    } else {
      humanReadableString += ` ${filterLabels[filterName].join(', ')}`
    }
    humanReadableString += additionText
  }

  if (humanReadableString === '') return humanReadableString

  return humanReadableString.substr(0, humanReadableString.length - additionText.length)
}

const setLocationHref = (href) => { window.location.href = href }
const getLocationHref = () => window.location.href

const fixSubCollectionTree = (collections, collectionId) => {
  const collection = collections.find(c => c.id === collectionId)
  const subCollections = collection.sub_collections
    .map(subCollection => fixSubCollectionTree(collections, subCollection.id))
  return {
    ...collection,
    sub_collections: subCollections
  }
}
export const fixCollectionTree = (biobank) => ({
  ...biobank,
  collections: biobank.collections
    .filter(collection => !collection.parent)
    .map(collection => fixSubCollectionTree(biobank.collections, collection.id))
})

export const filterCollectionTree = (collectionIds, collections) =>
  collections.reduce(
    (accumulator, collection) => {
      const filteredSubCollections = filterCollectionTree(collectionIds, collection.sub_collections)
      if (collectionIds.includes(collection.id) || filteredSubCollections.length) {
        return [...accumulator, { ...collection, sub_collections: filteredSubCollections }]
      }
      return accumulator
    }, [])

export default {
  createBiobankRSQLQuery,
  createRSQLQuery,
  createNegotiatorQueryBody,
  getHumanReadableString,
  setLocationHref,
  getLocationHref
}
