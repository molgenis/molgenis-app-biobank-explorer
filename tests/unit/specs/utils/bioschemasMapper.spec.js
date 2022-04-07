import {
  mapBiobankToBioschemas,
  mapCollectionToBioschemas
} from '../../../../src/utils/bioschemasMapper'

describe('bioschemasMapper', () => {
  const collectionData = {
    _meta: {
      name: 'meta'
    },
    id: 'c-001',
    name: 'beautiful collection',
    description: 'beautiful samples',
    order_of_magnitude: {
      _href: '/api/v2/eu_bbmri_eric_biobank_size/3',
      id: 3,
      size: '666'
    },
    network: [],
    age_low: 0,
    age_high: 20,
    age_unit: [{ label: 'years' }],
    type: [{ label: 'type1' }, { label: 'type2' }],
    sex: [{
      id: 'FEMALE',
      label: 'Female',
      _href: '/api/v2/eu_bbmri_eric_sex_types/FEMALE'
    }, {
      id: 'MALE',
      label: 'Male',
      _href: '/api/v2/eu_bbmri_eric_sex_types/MALE'
    }],
    materials: [{ // One material with an ontology term
      id: 'WHOLE_BLOOD',
      _href: '/api/v2/eu_bbmri_eric_material_types/WHOLE_BLOOD',
      label: 'Blood'
    }, { // one without
      id: 'MATERIAL_2',
      _href: '/api/v2/eu_bbmri_eric_material_types/MATERIAL_2',
      label: 'material2'
    }],
    storage_temperatures: [{
      id: 0,
      size: '10',
      _href: '/api/v2/eu_bbmri_eric_biobank_size/10',
      label: '10 degrees'
    }],
    data_categories: [{
      _href: '/api/v2/eu_bbmri_eric_data_types/ONE_TYPE',
      label: 'One type'
    }],
    diagnosis_available: [{
      _href: '/api/v2/eu_bbmri_eric_diagnosis_available/urn:miriam:icd:Y01.1',
      id: 'urn:miriam:icd:Y01.1',
      uri: 'http://identifiers.org/icd/Y01.1',
      label: 'Common cold'
    }, {
      _href: '/api/v2/eu_bbmri_eric_diagnosis_available/urn:miriam:icd:Y02.1',
      id: 'urn:miriam:icd:Y02.1',
      uri: 'http://identifiers.org/icd/Y02.1',
      label: 'Mysterious illness'
    }, {
      _href: '/api/v2/eu_bbmri_eric_diagnosis_available/urn:miriam:icd:Y03.1',
      id: 'urn:miriam:icd:Y03.1',
      uri: 'http://identifiers.org/icd/Y03.1',
      label: 'Instaneous death'
    }],
    head_lastname: 'Thermopolis Renaldi',
    head_firstname: 'Amelia Mignonette',
    head_role: 'Princess of Genovia',
    contact: {
      title_before_name: 'Princess of Genovia',
      last_name: 'Thermopolis Renaldi',
      first_name: 'Amelia Mignonette',
      email: 'mia@genovia.gnv',
      phone: '+66 123456789'
    },
    sub_collections: [
      {
        id: '1',
        materials: [{ id: 'OTHER', label: 'Other' }],
        description: 'Description of test1',
        name: 'Test 1',
        order_of_magnitude: { id: 4, size: '10.000 - 100.000' },
        data_categories: [{ id: 'BIOLOGICAL_SAMPLES', label: 'Biological samples' }],
        parent_collection: { id: 'c-001', name: 'beautiful collection' },
        sub_collections: []
      },
      {
        id: '2',
        materials: [{ id: 'OTHER', label: 'Other' }],
        name: 'Test 2',
        data_categories: [{ id: 'BIOLOGICAL_SAMPLES', label: 'Biological samples' }],
        order_of_magnitude: { id: 4, size: '10.000 - 100.000' },
        parent_collection: { id: 'c-001', name: 'beautiful collection' },
        sub_collections: [
          {
            id: '3',
            materials: [{ id: 'OTHER', label: 'Other' }],
            name: 'Test 3 (sub sub)',
            order_of_magnitude: { id: 4, size: '10.000 - 100.000' },
            parent_collection: { id: '2', name: 'Test 2' },
            sub_collections: []
          }
        ]
      }
    ],
    collaboration_commercial: false,
    collaboration_non_for_profit: true,
    country: { name: 'Genovia' },
    quality: [{ label: 'Order of the rose' }],
    biobank: {
      id: 'b-001',
      name: 'beautiful biobank',
      juridical_person: 'Is this even a person?',
      email: 'info@beautiful-biobank.gnv',
      url: 'https://beautiful-biobank.gnv',
      partner_charter_signed: true
    },
    data_use: [{
      label: 'DUO Testlabel',
      uri: 'https://external-link-to-duo-item'
    },
    {
      label: 'DUO Testlabel',
      uri: ''
    }]
  }

  const biobankData = {
    _href: '/api/v2/eu_bbmri_eric_biobanks/b-001',
    id: 'b-001',
    pid: '21.12110/b-001',
    name: 'beautiful biobank',
    acronym: 'BB',
    description: 'cool biobank description',
    juridical_person: 'BB LTD',
    country: {
      _href: '/api/v2/eu_bbmri_eric_countries/IT',
      id: 'IT',
      name: 'Italy'
    },
    partner_charter_signed: false,
    contact_priority: 0,
    latitude: '50.45728',
    longitude: '30.37733',
    also_known: [],
    contact: {
      _href: '/api/v2/eu_bbmri_eric_persons/b-001-contact',
      id: 'b-001-contact',
      first_name: 'mario',
      last_name: 'rossi',
      email: 'email@emal.com',
      address: 'via delle vie 10',
      city: 'Rome',
      country: {
        _href: '/api/v2/eu_bbmri_eric_countries/IT',
        id: 'IT',
        name: 'Italy'
      },
      biobanks: [
        {
          _href: '/api/v2/eu_bbmri_eric_biobanks/b-001',
          id: 'b-001',
          name: 'beatiful biobank'
        }
      ],
      collections: [
        {
          _href: '/api/v2/eu_bbmri_eric_collections/c-001',
          id: 'c-001',
          name: 'beautiful collection'
        }
      ]
    },
    collections: [
      {
        _href: '/api/v2/eu_bbmri_eric_collections/c-001',
        id: 'c-001',
        name: 'beautiful collection',
        description: 'beautiful collection description'
      }
    ],
    collaboration_commercial: true,
    collaboration_non_for_profit: true,
    capabilities: [],
    operational_standards: [],
    quality: []
  }

  const biobankDataNoContact = {
    _href: '/api/v2/eu_bbmri_eric_biobanks/b-001',
    id: 'b-001',
    pid: '21.12110/b-001',
    name: 'beautiful biobank',
    acronym: 'BB',
    description: 'cool biobank description',
    juridical_person: 'BB LTD',
    country: {
      _href: '/api/v2/eu_bbmri_eric_countries/IT',
      id: 'IT',
      name: 'Italy'
    },
    partner_charter_signed: false,
    contact_priority: 0,
    latitude: '50.45728',
    longitude: '30.37733',
    also_known: [],
    collections: [
      {
        _href: '/api/v2/eu_bbmri_eric_collections/c-001',
        id: 'c-001',
        name: 'beautiful collection',
        description: 'beautiful collection description'
      }
    ],
    collaboration_commercial: true,
    collaboration_non_for_profit: true,
    capabilities: [],
    operational_standards: [],
    quality: []
  }

  const biobankDataIncompleteContact = {
    _href: '/api/v2/eu_bbmri_eric_biobanks/b-001',
    id: 'b-001',
    pid: '21.12110/b-001',
    name: 'beautiful biobank',
    acronym: 'BB',
    description: 'cool biobank description',
    juridical_person: 'BB LTD',
    country: {
      _href: '/api/v2/eu_bbmri_eric_countries/IT',
      id: 'IT',
      name: 'Italy'
    },
    partner_charter_signed: false,
    contact_priority: 0,
    latitude: '50.45728',
    longitude: '30.37733',
    also_known: [],
    contact: {
      _href: '/api/v2/eu_bbmri_eric_persons/b-001-contact',
      id: 'b-001-contact',
      first_name: 'mario',
      last_name: 'rossi',
      email: 'email@emal.com',
      country: {
        _href: '/api/v2/eu_bbmri_eric_countries/IT',
        id: 'IT',
        name: 'Italy'
      },
      biobanks: [
        {
          _href: '/api/v2/eu_bbmri_eric_biobanks/b-001',
          id: 'b-001',
          name: 'beatiful biobank'
        }
      ],
      collections: [
        {
          _href: '/api/v2/eu_bbmri_eric_collections/c-001',
          id: 'c-001',
          name: 'beautiful collection'
        }
      ]
    },
    collections: [
      {
        _href: '/api/v2/eu_bbmri_eric_collections/c-001',
        id: 'c-001',
        name: 'beautiful collection',
        description: 'beautiful collection description'
      }
    ],
    collaboration_commercial: true,
    collaboration_non_for_profit: true,
    capabilities: [],
    operational_standards: [],
    quality: []
  }

  describe('mapCollectionsData', () => {
    it('should generate bioschemas for collections', () => {
      // It tests all the cases for additionalProperty:
      // 1: Data with a URI from server (e.g., diagnosis available)
      // 2: Data without uri but with ontology term for the property in the code (e.g., materials WHOLE BLOOD)
      // 3: Data without uri and without an ontology term for the property in the code (e.g., materials material 2)
      // For the properties it tests cases with and without an associated ontology term
      const expected = {
        '@context': 'https://schema.org',
        '@type': 'Dataset',
        '@id': 'http://localhost/#/collection/c-001',
        description: 'beautiful samples',
        identifier: 'c-001',
        keywords: 'sample, collection',
        name: 'beautiful collection',
        url: 'http://localhost/#/collection/c-001',
        includedInDataCatalog: {
          '@type': 'DataCatalog',
          '@id': 'http://localhost/#/biobank/b-001',
          name: 'beautiful biobank',
          url: 'http://localhost/#/biobank/b-001'
        },
        additionalProperty: [{
          '@type': 'PropertyValue',
          propertyId: 'http://purl.obolibrary.org/obo/OGMS_0000073',
          name: 'diagnosis_available',
          value: {
            '@type': 'CategoryCode',
            '@id': 'http://identifiers.org/icd/Y01.1',
            codeValue: 'Y01.1'
          }
        }, {
          '@type': 'PropertyValue',
          propertyId: 'http://purl.obolibrary.org/obo/OGMS_0000073',
          name: 'diagnosis_available',
          value: {
            '@type': 'CategoryCode',
            '@id': 'http://identifiers.org/icd/Y02.1',
            codeValue: 'Y02.1'
          }
        }, {
          '@type': 'PropertyValue',
          propertyId: 'http://purl.obolibrary.org/obo/OGMS_0000073',
          name: 'diagnosis_available',
          value: {
            '@type': 'CategoryCode',
            '@id': 'http://identifiers.org/icd/Y03.1',
            codeValue: 'Y03.1'
          }
        }, {
          '@type': 'PropertyValue',
          name: 'materials',
          propertyId: 'http://purl.obolibrary.org/obo/NCIT_C93863',
          value: {
            '@type': 'CategoryCode',
            '@id': 'http://purl.obolibrary.org/obo/OBI_0000655',
            codeValue: 'OBI_0000655'
          }
        }, {
          '@type': 'PropertyValue',
          propertyId: 'http://purl.obolibrary.org/obo/NCIT_C93863',
          name: 'materials',
          value: 'material2'
        }, {
          '@type': 'PropertyValue',
          propertyId: undefined,
          name: 'data_categories',
          value: 'One type'
        }, {
          '@type': 'PropertyValue',
          propertyId: 'http://purl.obolibrary.org/obo/OMIABIS_0001013',
          name: 'storage_temperatures',
          value: '10 degrees'
        }, {
          '@type': 'PropertyValue',
          propertyId: 'http://purl.obolibrary.org/obo/PATO_0000047',
          name: 'sex',
          value: {
            '@type': 'CategoryCode',
            '@id': 'http://purl.obolibrary.org/obo/PATO_0000383',
            codeValue: 'PATO_0000383'
          }
        }, {
          '@type': 'PropertyValue',
          propertyId: 'http://purl.obolibrary.org/obo/PATO_0000047',
          name: 'sex',
          value: {
            '@type': 'CategoryCode',
            '@id': 'http://purl.obolibrary.org/obo/PATO_0000384',
            codeValue: 'PATO_0000384'
          }
        }, {
          '@type': 'PropertyValue',
          propertyId: undefined,
          name: 'order_of_magnitude',
          value: '666'
        }]
      }
      const actual = mapCollectionToBioschemas(collectionData)
      expect(actual).toStrictEqual(expected)
    })
  })
  describe('mapCollectionsDataMissingDescription', () => {
    it("should use name as description in case the collection doesn't have one", () => {
      collectionData.description = undefined
      const actual = mapCollectionToBioschemas(collectionData)
      expect(actual.description).toStrictEqual(collectionData.name)
    })
  })

  describe('mapBiobankData', () => {
    it('should generate bioschemas for biobank', () => {
      const expected = {
        '@context': 'https://schema.org',
        '@type': 'DataCatalog',
        '@id': 'http://hdl.handle.net/21.12110/b-001',
        description: 'cool biobank description',
        keywords: 'biobank',
        name: 'beautiful biobank',
        provider: {
          '@type': 'Organization',
          description: 'cool biobank description',
          legalName: 'BB LTD',
          name: 'beautiful biobank',
          sameAs: 'http://localhost/#/biobank/b-001',
          topic: 'http://edamontology.org/topic_3337',
          contactPoint: {
            '@type': 'ContactPoint',
            email: 'email@emal.com'
          },
          location: {
            '@type': 'PostalAddress',
            contactType: 'juridical person',
            addressLocality: 'Rome, Italy',
            streetAddress: 'via delle vie 10'
          }
        },
        url: 'http://localhost/#/biobank/b-001',
        alternateName: 'BB',
        dataset: [{
          '@type': 'Dataset',
          '@id': 'http://localhost/#/collection/c-001',
          url: 'http://localhost/#/collection/c-001',
          identifier: 'c-001',
          name: 'beautiful collection',
          description: 'beautiful collection description'
        }],
        identifier: 'b-001'
      }
      const actual = mapBiobankToBioschemas(biobankData)
      expect(actual).toStrictEqual(expected)
    })
  })

  describe('mapBiobankDataNoCollectionDescription', () => {
    it('should generate bioschemas for biobank and use the collection name as description', () => {
      const expected = {
        '@context': 'https://schema.org',
        '@type': 'DataCatalog',
        '@id': 'http://hdl.handle.net/21.12110/b-001',
        description: 'cool biobank description',
        keywords: 'biobank',
        name: 'beautiful biobank',
        provider: {
          '@type': 'Organization',
          description: 'cool biobank description',
          legalName: 'BB LTD',
          name: 'beautiful biobank',
          sameAs: 'http://localhost/#/biobank/b-001',
          topic: 'http://edamontology.org/topic_3337',
          contactPoint: {
            '@type': 'ContactPoint',
            email: 'email@emal.com'
          },
          location: {
            '@type': 'PostalAddress',
            contactType: 'juridical person',
            addressLocality: 'Rome, Italy',
            streetAddress: 'via delle vie 10'
          }
        },
        url: 'http://localhost/#/biobank/b-001',
        alternateName: 'BB',
        dataset: [{
          '@type': 'Dataset',
          '@id': 'http://localhost/#/collection/c-001',
          url: 'http://localhost/#/collection/c-001',
          identifier: 'c-001',
          name: 'beautiful collection',
          description: 'beautiful collection'
        }],
        identifier: 'b-001'
      }
      biobankData.collections[0].description = undefined
      const actual = mapBiobankToBioschemas(biobankData)
      expect(actual).toStrictEqual(expected)
    })
  })

  describe('mapBiobankDataContactIncomplete', () => {
    it('should generate bioschemas for biobank that misses some contact info', () => {
      const expected = {
        '@context': 'https://schema.org',
        '@type': 'DataCatalog',
        '@id': 'http://hdl.handle.net/21.12110/b-001',
        description: 'cool biobank description',
        keywords: 'biobank',
        name: 'beautiful biobank',
        provider: {
          '@type': 'Organization',
          description: 'cool biobank description',
          legalName: 'BB LTD',
          name: 'beautiful biobank',
          sameAs: 'http://localhost/#/biobank/b-001',
          topic: 'http://edamontology.org/topic_3337',
          contactPoint: {
            '@type': 'ContactPoint',
            email: 'email@emal.com'
          },
          location: {
            '@type': 'PostalAddress',
            contactType: 'juridical person',
            addressLocality: 'Italy',
            streetAddress: undefined
          }
        },
        url: 'http://localhost/#/biobank/b-001',
        alternateName: 'BB',
        dataset: [{
          '@type': 'Dataset',
          '@id': 'http://localhost/#/collection/c-001',
          url: 'http://localhost/#/collection/c-001',
          identifier: 'c-001',
          name: 'beautiful collection',
          description: 'beautiful collection description'
        }],
        identifier: 'b-001'
      }
      const actual = mapBiobankToBioschemas(biobankDataIncompleteContact)
      expect(actual).toStrictEqual(expected)
    })
  })

  describe('mapBiobankDataNoContact', () => {
    it('should generate bioschemas for biobank that misses contact info', () => {
      const expected = {
        '@context': 'https://schema.org',
        '@type': 'DataCatalog',
        '@id': 'http://hdl.handle.net/21.12110/b-001',
        description: 'cool biobank description',
        keywords: 'biobank',
        name: 'beautiful biobank',
        provider: {
          '@type': 'Organization',
          description: 'cool biobank description',
          legalName: 'BB LTD',
          name: 'beautiful biobank',
          sameAs: 'http://localhost/#/biobank/b-001',
          topic: 'http://edamontology.org/topic_3337',
          contactPoint: undefined,
          location: undefined
        },
        url: 'http://localhost/#/biobank/b-001',
        alternateName: 'BB',
        dataset: [{
          '@type': 'Dataset',
          '@id': 'http://localhost/#/collection/c-001',
          url: 'http://localhost/#/collection/c-001',
          identifier: 'c-001',
          name: 'beautiful collection',
          description: 'beautiful collection description'
        }],
        identifier: 'b-001'
      }
      const actual = mapBiobankToBioschemas(biobankDataNoContact)
      expect(actual).toStrictEqual(expected)
    })
  })
})
