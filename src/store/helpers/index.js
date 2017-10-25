import utils from '../../utils'

/**
 * @example queries
 * q=country.id=in=(NL,BE)
 * q=materials.id=in=(RNA,DNA)
 * q=diagnosis_available.code=in=(C18,L40)
 * q=standards.id=in=(cen-ts-16835-1-2015,cen-ts-16827-1-2015)
 */
const createRSQLQuery = (state) => {
  const queryParts = []
  queryParts.push(utils.createInQuery('country', state.country.filters))
  queryParts.push(utils.createInQuery('materials', state.materials.filters))
  queryParts.push(utils.createInQuery('standards', state.standards.filters))
  queryParts.push(utils.createInQuery('diagnosis_available', state.diagnosis_available.filters.map(filter => filter.id)))

  let query = utils.queryPartsToQuery(queryParts).length > 0 ? '&q=' + utils.queryPartsToQuery(queryParts) : ''

  if (state.search) {
    query += query.length > 0 ? `;*=q=${state.search}` : `&q=*=q=${state.search}`
  }

  return query
}

const createNegotiatorQueryBody = (state, url) => {
  const collections = getNegotiatorQueryObjects(state.biobanks)
  const humanReadable = getHumanReadableString(state)

  return {
    /* Remove the nToken from the URL to prevent duplication on the negotiator side when a query is edited more than once */
    URL: url.replace(/&nToken=\w{32}/, ''),
    collections: collections,
    humanReadable: humanReadable,
    nToken: state.nToken
  }
}

const getHumanReadableString = (state) => {
  let humanReadableString = ''

  const countries = state.country.filters
  const materials = state.materials.filters
  const standards = state.standards.filters
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

  if (standards.length > 0) {
    if (humanReadableString.length > 0) humanReadableString += ' and '
    humanReadableString += 'selected standards are ' + standards.join(',')
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

export default {
  createRSQLQuery,
  createNegotiatorQueryBody,
  getHumanReadableString,
  getNegotiatorQueryObjects
}
