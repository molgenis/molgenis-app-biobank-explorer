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

const getJsonLDAdditionalProperty = (data, propertyName) => {
  const property = {
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
    '@type': 'DataRecord',
    '@id': collection.id,
    provider: {
      '@type': 'Organization',
      '@id': `${window.location.protocol}//${window.location.host}/${collection.biobank.id}`,
      identifier: collection.biobank.id,
      url: `${window.location.protocol}//${window.location.host}${collection.biobank._href}`
    },
    additionalProperty: []
  }
  const properties = ['diagnosis_available', 'materials', 'data_categories']
  properties.forEach(prop => {
    if (prop in collection) {
      collection[prop].forEach(item =>
        jsonld.additionalProperty.push(getJsonLDAdditionalProperty(item, prop))
      )
    }
  })
  return jsonld
}

export const mapBiobankDataOrganization = (biobank) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    identifier: biobank.id,
    url: `${window.location.protocol}//${window.location.host}${biobank._href}`,
    name: biobank.name,
    alternateName: biobank.acronym,
    legalName: biobank.juridical_person,
    description: biobank.description,
    email: biobank.contact.email,
    address: {
      '@type': 'PostalAddress',
      contactType: 'juridical person',
      addressLocality: biobank.contact ? `${biobank.contact.city}, ${biobank.contact.country.name}` : undefined,
      streetAddress: biobank.contact.address || undefined
    }
  }
}

export const mapBiobankDataCatalog = (biobank) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'DataCatalog',
    keywords: 'biobanks',
    // description taken from BBMRI-Eric Background page
    description: 'The BBMRI-ERIC Directory is a tool that collects and makes available information about biobanks throughout Europe that are willing to share their data and/or samples, and to collaborate with other research groups',
    provider: {
      '@type': 'Organization',
      id: `${window.location.protocol}//${window.location.host}${biobank._href}`,
      identifier: biobank.id,
      url: `${window.location.protocol}//${window.location.host}${biobank._href}`
    },
    dataset: Array.from(biobank.collections, collection => {
      return {
        '@type': 'DataRecord',
        '@id': `${window.location.protocol}//${window.location.host}${collection._href}`,
        url: `${window.location.protocol}//${window.location.host}${collection._href}`,
        identifier: collection.id,
        name: collection.name
      }
    })
  }
}
