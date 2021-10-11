import {
  mapCollectionsDetailsTableContent,
  mapAgeRange,
  mapNetworkInfo,
  mapContactInfo,
  mapNetworkData,
  mapUrl,
  getSize,
  getNameOfHead,
  collectionReportInformation
} from '../../../../src/utils/templateMapper'

let collectionsReport

describe('templateMapper', () => {
  beforeEach(() => {
    collectionsReport = {
      _meta: {
        name: 'meta'
      },
      id: 'c-001',
      name: 'beautiful collection',
      description: 'beautiful samples',
      order_of_magnitude: {
        size: '777'
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
  })
  describe('mapCollectionsDetailsTableContent', () => {
    it('should generate stringValues of details table content', () => {
      const actual = mapCollectionsDetailsTableContent(collectionsReport)
      const expectedSize = ['777']
      expect(actual.Size.value).toStrictEqual(expectedSize)
    })

    it('should generate listValues of details table content', () => {
      const actual = mapCollectionsDetailsTableContent(collectionsReport)
      expect(actual.Type.value).toStrictEqual(['type1', 'type2'])
      expect(actual.Storage_temperatures.value).toStrictEqual(['10 degrees'])
      expect(actual.Data_categories.value).toStrictEqual(['One type'])
      expect(actual.Diagnosis_available.value).toStrictEqual(['Common cold', 'Mysterious illness', 'Instaneous death'])
    })
  })

  describe('mapAgeRange', () => {
    it('should age range below max age', () => {
      const actual = mapAgeRange(undefined, 20, [{ label: 'years' }])
      expect(actual).toBe('< 20 years')
    })

    it('should age range above min age', () => {
      const actual = mapAgeRange(0, undefined, [{ label: 'years' }])
      expect(actual).toBe('> 0 years')
    })

    it('should age range between ages', () => {
      const actual = mapAgeRange(0, 20, [{ label: 'years' }])
      expect(actual).toBe('0-20 years')
    })
  })

  describe('Collection Report Information', () => {
    it('should create a readable form for contact information', () => {
      const actual = collectionReportInformation(collectionsReport)
      expect(actual.head).toBe('Amelia Mignonette Thermopolis Renaldi (Princess of Genovia)')
    })
    it('should create a readable form for contact', () => {
      const actual = collectionReportInformation(collectionsReport)
      expect(actual.contact.name).toBe('Princess of Genovia Amelia Mignonette Thermopolis Renaldi')
      expect(actual.contact.email).toBe('mia@genovia.gnv')
      expect(actual.contact.phone).toBe('+66 123456789')
    })

    it('should generate a certification array', () => {
      const actual = collectionReportInformation(collectionsReport)
      expect(actual.certifications).toStrictEqual(['Order of the rose'])
    })

    it('should only add collaboration items that are true', () => {
      const actual = collectionReportInformation(collectionsReport)
      expect(actual.collaboration).toStrictEqual([{ name: 'Not for profit', value: 'yes' }])
    })

    it('should generate an array if all items are true', () => {
      collectionsReport.collaboration_commercial = true
      const actual = collectionReportInformation(collectionsReport)
      expect(actual.collaboration).toStrictEqual([{ name: 'Commercial', value: 'yes' }, { name: 'Not for profit', value: 'yes' }])
    })
  })

  describe('mapCollectionsDetailsTableContent', () => {
    it('should add details for collection and for sub collections', () => {
      const expected = {
        Age: {
          type: 'string-with-key',
          value: '0-20 years'
        },
        Data_categories: {
          value: [
            'One type'
          ]
        },
        Data_use: {
          value: [
            {
              label: 'DUO Testlabel',
              uri: 'https://external-link-to-duo-item'
            },
            {
              label: 'DUO Testlabel',
              uri: '#'
            }
          ]
        },
        Diagnosis_available: {
          value: [
            'Common cold',
            'Mysterious illness',
            'Instaneous death'
          ]
        },
        Materials: {
          value: [
            'material1',
            'material2'
          ]
        },
        Sex: {
          value: [
            'male',
            'female'
          ]
        },
        Size: {
          badgeColor: 'success',
          type: 'list',
          value: [
            '777'
          ]
        },
        Storage_temperatures: {
          value: [
            '10 degrees'
          ]
        },
        Type: {
          value: [
            'type1',
            'type2'
          ]
        },
        _meta: {
          name: 'meta'
        },
        age_high: 20,
        age_low: 0,
        age_unit: [
          {
            label: 'years'
          }
        ],
        biobank: {
          email: 'info@beautiful-biobank.gnv',
          id: 'b-001',
          juridical_person: 'Is this even a person?',
          name: 'beautiful biobank',
          partner_charter_signed: true,
          url: 'https://beautiful-biobank.gnv'
        },
        collaboration_commercial: false,
        collaboration_non_for_profit: true,
        contact: {
          email: 'mia@genovia.gnv',
          first_name: 'Amelia Mignonette',
          last_name: 'Thermopolis Renaldi',
          phone: '+66 123456789',
          title_before_name: 'Princess of Genovia'
        },
        country: {
          name: 'Genovia'
        },
        data_categories: [
          {
            label: 'One type'
          }
        ],
        data_use: [
          {
            label: 'DUO Testlabel',
            uri: 'https://external-link-to-duo-item'
          },
          {
            label: 'DUO Testlabel',
            uri: ''
          }
        ],
        description: 'beautiful samples',
        diagnosis_available: [
          {
            label: 'Common cold'
          },
          {
            label: 'Mysterious illness'
          },
          {
            label: 'Instaneous death'
          }
        ],
        head_firstname: 'Amelia Mignonette',
        head_lastname: 'Thermopolis Renaldi',
        head_role: 'Princess of Genovia',
        id: 'c-001',
        materials: [
          {
            label: 'material1'
          },
          {
            label: 'material2'
          }
        ],
        name: 'beautiful collection',
        network: [],
        order_of_magnitude: {
          size: '777'
        },
        quality: [
          {
            label: 'Order of the rose'
          }
        ],
        sex: [
          {
            label: 'male'
          },
          {
            label: 'female'
          }
        ],
        storage_temperatures: [
          {
            label: '10 degrees'
          }
        ],
        sub_collections: [
          {
            Age: {
              type: 'string-with-key',
              value: undefined
            },
            Data_categories: {
              value: [
                'Biological samples'
              ]
            },
            Data_use: {
              value: []
            },
            Diagnosis_available: {
              value: []
            },
            Materials: {
              value: [
                'Other'
              ]
            },
            Sex: {
              value: []
            },
            Size: {
              badgeColor: 'success',
              type: 'list',
              value: [
                '10.000 - 100.000'
              ]
            },
            Storage_temperatures: {
              value: []
            },
            Type: {
              value: []
            },
            data_categories: [
              {
                id: 'BIOLOGICAL_SAMPLES',
                label: 'Biological samples'
              }
            ],
            description: 'Description of test1',
            id: '1',
            materials: [
              {
                id: 'OTHER',
                label: 'Other'
              }
            ],
            name: 'Test 1',
            order_of_magnitude: {
              id: 4,
              size: '10.000 - 100.000'
            },
            parent_collection: {
              id: 'c-001',
              name: 'beautiful collection'
            },
            sub_collections: []
          },
          {
            Age: {
              type: 'string-with-key',
              value: undefined
            },
            Data_categories: {
              value: [
                'Biological samples'
              ]
            },
            Data_use: {
              value: []
            },
            Diagnosis_available: {
              value: []
            },
            Materials: {
              value: [
                'Other'
              ]
            },
            Sex: {
              value: []
            },
            Size: {
              badgeColor: 'success',
              type: 'list',
              value: [
                '10.000 - 100.000'
              ]
            },
            Storage_temperatures: {
              value: []
            },
            Type: {
              value: []
            },
            data_categories: [
              {
                id: 'BIOLOGICAL_SAMPLES',
                label: 'Biological samples'
              }
            ],
            id: '2',
            materials: [
              {
                id: 'OTHER',
                label: 'Other'
              }
            ],
            name: 'Test 2',
            order_of_magnitude: {
              id: 4,
              size: '10.000 - 100.000'
            },
            parent_collection: {
              id: 'c-001',
              name: 'beautiful collection'
            },
            sub_collections: [
              {
                Age: {
                  type: 'string-with-key',
                  value: undefined
                },
                Data_categories: {
                  value: []
                },
                Data_use: {
                  value: []
                },
                Diagnosis_available: {
                  value: []
                },
                Materials: {
                  value: [
                    'Other'
                  ]
                },
                Sex: {
                  value: []
                },
                Size: {
                  badgeColor: 'success',
                  type: 'list',
                  value: [
                    '10.000 - 100.000'
                  ]
                },
                Storage_temperatures: {
                  value: []
                },
                Type: {
                  value: []
                },
                id: '3',
                materials: [
                  {
                    id: 'OTHER',
                    label: 'Other'
                  }
                ],
                name: 'Test 3 (sub sub)',
                order_of_magnitude: {
                  id: 4,
                  size: '10.000 - 100.000'
                },
                parent_collection: {
                  id: '2',
                  name: 'Test 2'
                },
                sub_collections: []
              }
            ]
          }
        ],
        type: [
          {
            label: 'type1'
          },
          {
            label: 'type2'
          }
        ]
      }
      const actual = mapCollectionsDetailsTableContent(collectionsReport)
      expect(actual).toStrictEqual(expected)
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
      expect(actual).toStrictEqual(expected)
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
      expect(actual).toStrictEqual(expected)
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
      expect(actual).toStrictEqual(expected)
    })
  })

  describe('mapUrl', () => {
    it('should do nothing if url is undefined', () => {
      const actual = mapUrl(undefined)
      expect(actual).toBe(undefined)
    })

    it('should add http:// if url doesnt start with http', () => {
      const actual = mapUrl('www.somewebsite.com')
      expect(actual).toBe('http://www.somewebsite.com')
    })

    it('should do nothing if url starts with http', () => {
      const actual = mapUrl('http://molgenis.org')
      expect(actual).toBe('http://molgenis.org')
    })
  })

  describe('getSize', () => {
    it('should return empty list if no size defined', () => {
      const actual = getSize({})
      expect(actual).toStrictEqual([])
    })

    it('should return size if size defined', () => {
      const actual = getSize({ size: '123', order_of_magnitude: { size: '100-200' } })
      expect(actual).toStrictEqual(['123 samples'])
    })

    it('should return order_of_magnitude if size undefined', () => {
      const actual = getSize({ order_of_magnitude: { size: '100-200' } })
      expect(actual).toStrictEqual(['100-200'])
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
      expect(actual).toBe('first last (role)')
    })

    it('should map last name and role', () => {
      const element = {
        head_lastname: 'last',
        head_role: 'role'
      }
      const actual = getNameOfHead(element)
      expect(actual).toBe('last (role)')
    })

    it('should return first and last name', () => {
      const element = {
        head_firstname: 'first',
        head_lastname: 'last'
      }
      const actual = getNameOfHead(element)
      expect(actual).toBe('first last')
    })

    it('should return undefined', () => {
      const element = {}
      const actual = getNameOfHead(element)
      expect(actual).toBe(undefined)
    })
  })
})
