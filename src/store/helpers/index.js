import { createInQuery, createQuery } from '../../utils'
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
    createInQuery('country', state.filters.selections.country || []),
    createQuery(state.filters.selections.materials, 'materials', state.filters.satisfyAll.includes('materials')),
    createQuery(state.filters.selections.type, 'type', state.filters.satisfyAll.includes('type')),
    createQuery(state.filters.selections.dataType, 'data_categories', state.filters.satisfyAll.includes('dataType')),
    createQuery(state.filters.selections.diagnosis_available, 'diagnosis_available.id', state.filters.satisfyAll.includes('diagnosis_available')),
    createQuery(state.collectionIdsWithSelectedQuality, 'id', state.filters.satisfyAll.includes('collection_quality')),
    createInQuery('collaboration_commercial', state.filters.selections.commercial_use || []),
    createQuery(state.filters.selections.collection_network, 'network', state.filters.satisfyAll.includes('collection_network')),
    state.filters.selections.search ? [{
      operator: 'OR',
      operands: ['name', 'id', 'acronym', 'biobank.name', 'biobank.id', 'biobank.acronym']
        .map(attr => ({ selector: attr, comparison: '=q=', arguments: state.filters.selections.search || '' }))
    }] : []
  ])
})

export const createBiobankRSQLQuery = (state) => transformToRSQL({
  operator: 'AND',
  operands: flatten([
    createInQuery('country', state.filters.selections.country || []),
    createInQuery('id', state.biobankIdsWithSelectedQuality),
    createQuery(state.filters.selections.biobank_network, 'network', state.filters.satisfyAll.includes('biobank_network')),
    createQuery(state.filters.selections.covid19, 'covid19biobank', state.filters.satisfyAll.includes('covid19'))
  ])
})

const createNegotiatorQueryBody = (state, getters, url) => {
  const result = {
    /* Remove the nToken from the URL to prevent duplication on the negotiator side when a query is edited more than once */
    URL: url.replace(/&nToken=\w{32}/, ''),
    entityId: state.negotiatorCollectionEntityId,
    humanReadable: getHumanReadableString(state, getters),
    nToken: state.nToken
  }

  const collections = state.isPodium ? getters.collectionsInPodium : getters.selectedCollections
  result.rsql = transformToRSQL({ operator: 'AND', operands: createInQuery('id', collections.map(sc => sc.value)) })
  result.humanReadable += result.humanReadable.length ? ' and with custom collection selection.' : 'Custom collection selection.'

  return result
}

export const getHumanReadableString = (state, { getFilterDefinitions }) => {
  const activeFilters = Object.keys(state.filters.selections)
  let humanReadableString = ''
  const additionText = ' and '

  const filterLabels = state.filters.labels
  const humanReadableStart = {}

  // Get all the filterdefinitions for current active filters and make a dictionary name: humanreadable
  getFilterDefinitions.filter(fd => activeFilters.includes(fd.name))
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
