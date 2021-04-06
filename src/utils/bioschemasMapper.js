import { getBaseUrl } from '@/utils/'

// Should be better to put in the data model
const getOntologyTerm = (property, term) => {
  const mappings = {
    properties: {
      diagnosis_available: 'http://purl.obolibrary.org/obo/OGMS_0000073',
      storage_temperatures: 'http://purl.obolibrary.org/obo/OMIABIS_0001013'
    },
    materials: {
      WHOLE_BLOOD: {
        code: 'OBI_0000655',
        uri: 'http://purl.obolibrary.org/obo/OBI_0000655',
        name: 'blood specimen'
      },
      FAECES: {
        code: 'OBI_0002503',
        uri: 'http://purl.obolibrary.org/obo/OBI_0002503',
        name: 'feces specimen'
      },
      PLASMA: {
        code: 'OBI_0100016',
        uri: 'http://purl.obolibrary.org/obo/OBI_0100016',
        name: 'blood plasma specimen'
      },
      SALIVA: {
        code: 'OBI_0002507',
        uri: 'http://purl.obolibrary.org/obo/OBI_0002507',
        name: 'saliva specimen'
      },
      SERUM: {
        code: 'OBI_0100017',
        uri: 'http://purl.obolibrary.org/obo/OBI_0100017',
        name: 'blood serum specimen'
      },
      TISSUE_FROZEN: {
        code: 'OBI_0000922',
        uri: 'http://purl.obolibrary.org/obo/OBI_0000922',
        name: 'frozen specimen'
      }
    },
    data_categories: {
      SURVEY_DATA: {
        code: 'OMIABIS_0000060',
        uri: 'http://purl.obolibrary.org/obo/OMIABIS_0000060',
        name: 'survey data'
      },
      MEDICAL_RECORDS: {
        code: 'OMIABIS_0001027',
        uri: 'http://purl.obolibrary.org/obo/OMIABIS_0001027',
        name: 'sample medical record'
      }
    }
  }
  return mappings[property][term]
}

const getCollectionVariableMeasured = (data, propertyName) => {
  const property = {
    '@type': 'PropertyValue',
    name: propertyName,
    value: data._href.split('/').slice(-1).pop(),
    url: getOntologyTerm('properties', propertyName) || undefined,
    valueReference: [{ // by default it adds a reference with data from the directory
      '@type': 'CategoryCode',
      codeValue: data.code || data.id || undefined,
      name: data.label,
      url: `${window.location.protocol}//${window.location.host}${data._href}`
    }]
  }

  if ('uri' in data) {
    // it means the data contains the uri of the code in the model
    property.valueReference.push({
      '@type': 'CategoryCode',
      codeValue: data.uri.split('/').slice(-1).pop() || undefined,
      url: data.uri
    })
  } else {
    const ontologyTerm = getOntologyTerm(propertyName, property.value)
    // it gets mappings from the static object. It should be better to include the uri in the model
    if (ontologyTerm) {
      property.valueReference.push({
        '@type': 'CategoryCode',
        codeValue: ontologyTerm.code,
        name: ontologyTerm.name,
        url: ontologyTerm.uri
      })
    }
  }
  return property
}

export const mapCollectionsData = (collection) => {
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    '@id': collection.id,
    name: collection.name,
    description: collection.description,
    url: `${getBaseUrl()}/collection/${collection.id}`,
    includedInDataCatalog: {
      '@type': 'DataCatalog',
      name: collection.biobank.name,
      url: `${getBaseUrl()}/biobank/${collection.biobank.id}`
    },
    variableMeasured: []
  }
  const properties = ['diagnosis_available', 'materials', 'data_categories']
  properties.forEach(prop => {
    if (prop in collection) {
      collection[prop].forEach(item =>
        jsonld.variableMeasured.push(getCollectionVariableMeasured(item, prop))
      )
    }
  })
  return jsonld
}

export const mapBiobankDataCatalog = (biobank) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'DataCatalog',
    description: biobank.description || biobank.name,
    keywords: 'biobank',
    url: `${getBaseUrl()}/biobank/${biobank.id}`,
    name: biobank.name,
    alternateName: biobank.acronym,
    identifier: biobank.id,
    provider: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      legalName: biobank.juridical_person,
      email: biobank.contatct ? biobank.contact.email : undefined,
      address: biobank.contact ? {
        '@type': 'PostalAddress',
        contactType: 'juridical person',
        addressLocality: `${biobank.contact.city}, ${biobank.contact.country.name}`,
        streetAddress: biobank.contact.address
      } : undefined
    },
    dataset: Array.from(biobank.collections, collection => {
      return {
        '@type': 'Dataset',
        '@id': `${getBaseUrl()}/collection/${collection.id}`,
        url: `${getBaseUrl()}/collection/${collection.id}`,
        identifier: collection.id,
        name: collection.name,
        description: collection.description
      }
    })
  }
}
