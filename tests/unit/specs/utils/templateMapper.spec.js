import { expect } from 'chai'
import {
  mapDetailsTableContent,
  mapAgeRange,
  mapCollectionsData,
  mapNetworkInfo,
  mapContactInfo,
  mapNetworkData,
  mapUrl,
  getSize,
  getNameOfHead,
  collectionReportInformation
} from '../../../../src/utils/templateMapper'

describe('templateMapper', () => {
  const collectionsReport = {
    _meta: {
      name: 'meta'
    },
    id: 'c-001',
    name: 'beautiful collection',
    description: 'beautiful samples',
    order_of_magnitude: {
      size: '666'
    },
    network: [],
    age_low: 0,
    age_high: 20,
    age_unit: [{ label: 'years' }],
    type: [{ label: 'type1' }, { label: 'type2' }],
    sex: [{ label: 'male' }, { label: 'female' }],
    materials: [{ label: 'material1' }, { label: 'material2' }],
    storage_temperatures: [{ label: '10 degrees' }],
    data_categories: [{ label: 'One type' }],
    diagnosis_available: [{ label: 'Common cold' }, { label: 'Mysterious illness' }, { label: 'Instaneous death' }],
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
    }
  }
  describe('mapDetailsTableContent', () => {
    it('should generate stringValues of details table content', () => {
      const actual = mapDetailsTableContent(collectionsReport)
      const expectedSize = ['666']
      expect(actual.Size.value).to.deep.equal(expectedSize)
    })

    it('should generate listValues of details table content', () => {
      const actual = mapDetailsTableContent(collectionsReport)
      expect(actual.Type.value).to.deep.equal(['type1', 'type2'])
      expect(actual.Storage.value).to.deep.equal(['10 degrees'])
      expect(actual.Data.value).to.deep.equal(['One type'])
      expect(actual.Diagnosis.value).to.deep.equal(['Common cold', 'Mysterious illness', 'Instaneous death'])
    })
  })

  describe('mapAgeRange', () => {
    it('should age range below max age', () => {
      const actual = mapAgeRange(undefined, 20, [{ label: 'years' }])
      expect(actual).to.equal('< 20 years')
    })

    it('should age range above min age', () => {
      const actual = mapAgeRange(0, undefined, [{ label: 'years' }])
      expect(actual).to.equal('> 0 years')
    })

    it('should age range between ages', () => {
      const actual = mapAgeRange(0, 20, [{ label: 'years' }])
      expect(actual).to.equal('0-20 years')
    })
  })

  describe('Collection Report Information', () => {
    it('should create a readable form for contact information', () => {
      const actual = collectionReportInformation(collectionsReport)
      expect(actual.head).to.equal('Amelia Mignonette Thermopolis Renaldi (Princess of Genovia)')
    })
    it('should create a readable form for contact', () => {
      const actual = collectionReportInformation(collectionsReport)
      expect(actual.contact.name).to.equal('Princess of Genovia Amelia Mignonette Thermopolis Renaldi')
      expect(actual.contact.email).to.equal('mia@genovia.gnv')
      expect(actual.contact.phone).to.equal('+66 123456789')
    })

    it('should generate a certification array', () => {
      const actual = collectionReportInformation(collectionsReport)
      expect(actual.certifications).to.deep.equal(['Order of the rose'])
    })

    it('should only add collaboration items that are true', () => {
      const actual = collectionReportInformation(collectionsReport)
      expect(actual.collaboration).to.deep.equal([{ name: 'Not for profit', value: 'yes' }])
    })

    it('should generate an array if all items are true', () => {
      collectionsReport.collaboration_commercial = true
      const actual = collectionReportInformation(collectionsReport)
      expect(actual.collaboration).to.deep.equal([{ name: 'Commercial', value: 'yes' }, { name: 'Not for profit', value: 'yes' }])
    })
  })

  describe('mapCollectionsData', () => {
    it('should generate details list data for sub collections', () => {
      const expected = [
        {
          description: 'Description of test1',
          parentCollection: { id: 'c-001', name: 'beautiful collection' },
          subCollections: [],
          name: 'Test 1',
          id: '1',
          content: {
            Size: {
              value: ['10.000 - 100.000'],
              type: 'list',
              badgeColor: 'success'
            },
            Materials: {
              value: ['Other'],
              type: 'list',
              badgeColor: 'danger'
            },
            Data: {
              value: ['Biological samples'],
              type: 'list',
              badgeColor: 'info'
            }
          }
        },
        {
          description: undefined,
          parentCollection: { id: 'c-001', name: 'beautiful collection' },
          subCollections: [
            {
              parentCollection: { id: '2', name: 'Test 2' },
              subCollections: [],
              name: 'Test 3 (sub sub)',
              id: '3',
              description: undefined,
              content: {
                Size: {
                  value: ['10.000 - 100.000'],
                  type: 'list',
                  badgeColor: 'success'
                },
                Materials: {
                  value: ['Other'],
                  type: 'list',
                  badgeColor: 'danger'
                },
                Data: {
                  value: [],
                  type: 'list',
                  badgeColor: 'info'
                }
              }
            }
          ],
          name: 'Test 2',
          id: '2',
          content: {
            Size: {
              value: ['10.000 - 100.000'],
              type: 'list',
              badgeColor: 'success'
            },
            Materials: {
              value: ['Other'],
              type: 'list',
              badgeColor: 'danger'
            },
            Data: {
              value: ['Biological samples'],
              type: 'list',
              badgeColor: 'info'
            }
          }
        }
      ]
      const actual = mapCollectionsData(collectionsReport.sub_collections)
      expect(actual).to.deep.equal(expected)
    })
  })

  describe('mapNetworkData', () => {
    it('should map network data', () => {
      const network = {
        common_collection_focus: true,
        common_charter: true,
        common_sops: false,
        common_data_access_policy: true,
        common_sample_access_policy: false,
        common_mta: true,
        common_image_access_policy: false,
        common_image_mta: false,
        common_representation: true,
        common_url: true
      }
      const expected = {
        'Common collection focus': {
          value: true,
          type: 'bool'
        },
        'Common charter': {
          value: true,
          type: 'bool'
        },
        'Common SOPS': {
          value: false,
          type: 'bool'
        },
        'Data access policy': {
          value: true,
          type: 'bool'
        },
        'Sample access policy': {
          value: false,
          type: 'bool'
        },
        'Common MTA': {
          value: true,
          type: 'bool'
        },
        'Common image access policy': {
          value: false,
          type: 'bool'
        },
        'Common image MTA': {
          value: false,
          type: 'bool'
        },
        'Common representation': {
          value: true,
          type: 'bool'
        },
        'Common URL': {
          value: true,
          type: 'bool'
        }
      }
      const actual = mapNetworkData(network)
      expect(actual).to.deep.equal(expected)
    })
  })

  describe('mapNetworkInfo', () => {
    it('should map network info', () => {
      const data = {
        network: [{
          name: 'Network',
          id: 'n'
        }]
      }
      const expected = [{
        name: { value: 'Network', type: 'string' },
        report: { value: '/network/n', type: 'report' }
      }]
      const actual = mapNetworkInfo(data)
      expect(actual).to.deep.equal(expected)
    })
  })

  describe('mapContactInfo', () => {
    it('should map network info', () => {
      const instance = {
        url: 'https://website.com',
        contact: { email: 'email@email.com' },
        juridical_person: 'blaat',
        country: {
          name: 'Netherlands'
        }
      }
      const expected = {
        website: { value: 'https://website.com', type: 'url' },
        email: { value: 'email@email.com', type: 'email' },
        juridical_person: { value: 'blaat', type: 'string' },
        name: { value: undefined, type: 'string' },
        country: { value: 'Netherlands', type: 'string' }
      }
      const actual = mapContactInfo(instance)
      expect(actual).to.deep.equal(expected)
    })
  })

  describe('mapUrl', () => {
    it('should do nothing if url is undefined', () => {
      const actual = mapUrl(undefined)
      expect(actual).to.equal(undefined)
    })

    it('should add http:// if url doesnt start with http', () => {
      const actual = mapUrl('www.somewebsite.com')
      expect(actual).to.equal('http://www.somewebsite.com')
    })

    it('should do nothing if url starts with http', () => {
      const actual = mapUrl('http://molgenis.org')
      expect(actual).to.equal('http://molgenis.org')
    })
  })

  describe('getSize', () => {
    it('should return empty list if no size defined', () => {
      const actual = getSize({})
      expect(actual).to.deep.equal([])
    })

    it('should return size if size defined', () => {
      const actual = getSize({ size: '123', order_of_magnitude: { size: '100-200' } })
      expect(actual).to.deep.equal(['123 samples'])
    })

    it('should return order_of_magnitude if size undefined', () => {
      const actual = getSize({ order_of_magnitude: { size: '100-200' } })
      expect(actual).to.deep.equal(['100-200'])
    })
  })

  describe('getNameOfHead', () => {
    it('should map full name', () => {
      const element = {
        head_firstname: 'first',
        head_lastname: 'last',
        head_role: 'role'
      }
      const actual = getNameOfHead(element)
      expect(actual).to.equal('first last (role)')
    })

    it('should map last name and role', () => {
      const element = {
        head_lastname: 'last',
        head_role: 'role'
      }
      const actual = getNameOfHead(element)
      expect(actual).to.equal('last (role)')
    })

    it('should return first and last name', () => {
      const element = {
        head_firstname: 'first',
        head_lastname: 'last'
      }
      const actual = getNameOfHead(element)
      expect(actual).to.equal('first last')
    })

    it('should return undefined', () => {
      const element = {}
      const actual = getNameOfHead(element)
      expect(actual).to.equal(undefined)
    })
  })
})
