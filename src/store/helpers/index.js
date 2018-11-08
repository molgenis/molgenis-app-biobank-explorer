import { createInQuery } from '@/utils'
import { flatten } from 'lodash'
import { transformToRSQL } from '@molgenis/rsql'

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
    createInQuery('country', state.showCountryFacet ? state.country.filters : state.preConfiguredCountyCode),
    createInQuery('materials', state.materials.filters),
    createInQuery('type', state.type.filters),
    createInQuery('data_categories', state.dataType.filters),
    createInQuery('diagnosis_available', state.diagnosis_available.filters.map(filter => filter.id)),
    createInQuery('id', state.collection_quality.collections),
    createInQuery('biobank', state.biobank_quality.biobanks),
    state.search ? [{
      operator: 'OR',
      operands: ['name', 'id', 'acronym', 'biobank.name', 'biobank.id', 'biobank.acronym']
        .map(attr => ({selector: attr, comparison: '=q=', arguments: state.search}))
    }] : []
  ])
})

export const CODE_REGEX = /^([A-Z]|[XVI]+)(\d{0,2}(-([A-Z]\d{0,2})?|\.\d{0,3})?)?$/i

export const createDiagnosisLabelQuery = (query) => transformToRSQL({selector: 'label', comparison: '=q=', arguments: query})

export const createDiagnosisCodeQuery = (query) => transformToRSQL({selector: 'code', comparison: '=like=', arguments: query.toUpperCase()})

const createNegotiatorQueryBody = (state, getters, url) => {
  const collections = getNegotiatorQueryObjects(getters.biobanks)
  const humanReadable = getHumanReadableString(state)

  return {
    /* Remove the nToken from the URL to prevent duplication on the negotiator side when a query is edited more than once */
    URL: url.replace(/&nToken=\w{32}/, ''),
    entityId: 'eu_bbmri_eric_collections',
    rsql: getters.rsql,
    collections: collections,
    humanReadable: humanReadable,
    nToken: state.nToken
  }
}

const getHumanReadableString = (state) => {
  let humanReadableString = ''

  const countries = state.country.filters
  const materials = state.materials.filters
  const collectionQuality = state.collection_quality.filters
  const types = state.type.filters
  const dataTypes = state.dataType.filters
  const diseases = state.diagnosis_available.filters.map(disease => disease.label)

  if (state.search.length > 0) {
    humanReadableString += 'Free text search contains ' + state.search
  }

  if (countries.length > 0) {
    if (humanReadableString.length > 0) humanReadableString += ' and '
    humanReadableString += 'selected countries are ' + countries.join(',')
  }

  if (materials.length > 0) {
    if (humanReadableString.length > 0) humanReadableString += ' and '
    humanReadableString += 'selected material types are ' + materials.join(',')
  }

  if (collectionQuality.length > 0) {
    if (humanReadableString.length > 0) humanReadableString += ' and '
    humanReadableString += 'selected collection quality standards are ' + collectionQuality.join(',')
  }

  if (types.length > 0) {
    if (humanReadableString.length > 0) humanReadableString += ' and '
    humanReadableString += 'selected collection types are ' + types.join(',')
  }

  if (dataTypes.length > 0) {
    if (humanReadableString.length > 0) humanReadableString += ' and '
    humanReadableString += 'selected data types are ' + dataTypes.join(',')
  }

  if (diseases.length > 0) {
    if (humanReadableString.length > 0) humanReadableString += ' and '
    humanReadableString += 'selected disease types are ' + diseases.join(',')
  }

  return humanReadableString
}

const getNegotiatorQueryObjects = (biobanks) => {
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
        return [...accumulator, {...collection, sub_collections: filteredSubCollections}]
      }
      return accumulator
    }, [])

export default {
  createRSQLQuery,
  createDiagnosisCodeQuery,
  createDiagnosisLabelQuery,
  createNegotiatorQueryBody,
  getHumanReadableString,
  getNegotiatorQueryObjects,
  setLocationHref,
  getLocationHref,
  CODE_REGEX
}
