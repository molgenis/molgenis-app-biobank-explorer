import api from '@molgenis/molgenis-api-client/dist/molgenis-api-client.es'
import { encodeRsqlValue } from '@molgenis/rsql/dist/rsql'
import { getUniqueIdArray } from '../utils'

export const BIOBANK_API_PATH = '/api/v2/eu_bbmri_eric_biobanks'
export const COLLECTION_API_PATH = '/api/v2/eu_bbmri_eric_collections'
export const COLLECTION_ATTRIBUTE_SELECTOR = 'collections(id,materials,diagnosis_available,name,type,order_of_magnitude(*),size,sub_collections(*),parent_collection,quality(*))'

export const fetchAllBiobanks = () => api.get(`${BIOBANK_API_PATH}?num=10000&attrs=${COLLECTION_ATTRIBUTE_SELECTOR},*`)
  .then(response => response.items)

export const fetchBiobankIds = (rsql, allBiobankIds) => rsql === ''
  ? Promise.resolve(allBiobankIds)
  : api.get(`${COLLECTION_API_PATH}?num=10000&attrs=~id,biobank(id)&q=${encodeRsqlValue(rsql)}`)
    .then(response => getUniqueIdArray(response.items.map(item => item.biobank.id)))
