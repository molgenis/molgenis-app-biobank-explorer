import { createInQuery, createComparisons } from '../../utils'
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
    createInQuery('country', state.country.filters),
    createInQuery('materials', state.materials.filters),
    createInQuery('type', state.type.filters),
    createInQuery('data_categories', state.dataType.filters),
    createInQuery('diagnosis_available', state.diagnosis_available.filters.map(filter => filter.id)),
    createInQuery('id', state.collection_quality.collections),
    createInQuery('network', state.collection_network.filters),
    state.search ? [{
      operator: 'OR',
      operands: ['name', 'id', 'acronym', 'biobank.name', 'biobank.id', 'biobank.acronym']
        .map(attr => ({ selector: attr, comparison: '=q=', arguments: state.search }))
    }] : []
  ])
})

export const createBiobankRSQLQuery = (state) => transformToRSQL({
  operator: 'AND',
  operands: flatten([
    createInQuery('country', state.country.filters),
    createInQuery('id', state.biobank_quality.biobanks),
    createInQuery('network', state.biobank_network.filters),
    createComparisons('covid19biobank', state.covid19.filters)
  ])
})

const BIOBANK_ID_REGEX = /api\/data\/eu_bbmri_eric_biobanks\/([^/]+)$/
export const getBiobankId = (link) => link.match(BIOBANK_ID_REGEX)[1]

export const CODE_REGEX = /^([A-Z]|[XVI]+)(\d{0,2}(-([A-Z]\d{0,2})?|\.\d{0,3})?)?$/i

export const createDiagnosisLabelQuery = (query) => transformToRSQL({ selector: 'label', comparison: '=q=', arguments: query })

export const createDiagnosisCodeQuery = (query) => transformToRSQL({ selector: 'code', comparison: '=like=', arguments: query.toUpperCase() })

const createNegotiatorQueryBody = (state, getters, url) => {
  // TODO: are the entity types fixed?
  const result = {
    /* Remove the nToken from the URL to prevent duplication on the negotiator side when a query is edited more than once */
    URL: url.replace(/&nToken=\w{32}/, ''),
    entityId: state.negotiatorCollectionEntityId,
    humanReadable: getHumanReadableString(state),
    nToken: state.nToken
  }
  if (getters.rsql) {
    result.rsql = getters.rsql
  }
  if (getters.biobankRsql) {
    result.biobankId = state.negotiatorBiobankEntityId
    result.biobankRsql = getters.biobankRsql
  }
  return result
}

const getHumanReadableString = (state) => {
  let humanReadableString = ''

  const countries = state.country.filters
  const materials = state.materials.filters
  const collectionQuality = state.collection_quality.filters
  const types = state.type.filters
  const dataTypes = state.dataType.filters
  const diseases = state.diagnosis_available.filters.map(disease => disease.label)
  const covid19 = state.covid19.filters
  const biobankNetwork = state.biobank_network.filters
  const collectionNetwork = state.collection_network.filters

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

  if (covid19.length > 0) {
    if (humanReadableString.length > 0) humanReadableString += ' and '
    humanReadableString += 'biobank covid19 features are ' + covid19.join(',')
  }

  if (biobankNetwork.length > 0) {
    if (humanReadableString.length > 0) humanReadableString += ' and '
    humanReadableString += 'biobank is part of network' + biobankNetwork.join(',')
  }

  if (collectionNetwork.length > 0) {
    if (humanReadableString.length > 0) humanReadableString += ' and '
    humanReadableString += 'collection is part of network ' + collectionNetwork.join(',')
  }

  return humanReadableString
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
  createRSQLQuery,
  createDiagnosisCodeQuery,
  createDiagnosisLabelQuery,
  createNegotiatorQueryBody,
  getHumanReadableString,
  setLocationHref,
  getLocationHref,
  getBiobankId,
  CODE_REGEX
}
