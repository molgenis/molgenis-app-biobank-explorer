import { createInQuery } from '../../utils'
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
    createInQuery('biobank', state.biobank_quality.biobanks),
    state.search ? [{
      operator: 'OR',
      operands: ['name', 'id', 'acronym', 'biobank.name', 'biobank.id', 'biobank.acronym']
        .map(attr => ({selector: attr, comparison: '=q=', arguments: state.search}))
    }] : []
  ])
})

/**
 * @example queries
 * q=label=query,id=q=query,code=q=query
 */
export const createDiagnosisRSQLQuery = (query) => transformToRSQL({
  operator: 'OR',
  operands: flatten([
    {selector: 'label', comparison: '=q=', arguments: query},
    {selector: 'id', comparison: '=q=', arguments: query},
    {selector: 'code', comparison: '=q=', arguments: query}
  ])
})

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

export default {
  createRSQLQuery,
  createDiagnosisRSQLQuery,
  createNegotiatorQueryBody,
  getHumanReadableString,
  getNegotiatorQueryObjects,
  setLocationHref,
  getLocationHref
}
