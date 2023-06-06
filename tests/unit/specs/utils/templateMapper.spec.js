import {
  getCollectionDetails,
  mapRange,
  mapNetworkInfo,
  mapContactInfo,
  mapUrl,
  getSize,
  getNameOfHead,
  collectionReportInformation,
  getViewmodel
} from '../../../../src/utils/templateMapper'

let collectionsReport

// TODO rewrite this completely
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
      head: {
        last_name: 'Thermopolis Renaldi',
        first_name: 'Amelia Mignonette',
        role: 'Princess of Genovia'
      },
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
  describe('getCollectionDetails', () => {
    it('should generate a string for values of Size', () => {
      const collectionDetails = getCollectionDetails(collectionsReport)
      const expectedSize = '777'

      const sizeAttribute = collectionDetails.viewmodel.attributes.find(attr => attr.label === 'Size:')

      expect(sizeAttribute.value).toStrictEqual(expectedSize)
    })

    it('should generate listValues of details table content', () => {
      const collectionDetails = getCollectionDetails(collectionsReport)

      const typeModel = collectionDetails.viewmodel.attributes.find(attr => attr.label === 'Type:')
      expect(typeModel.value).toStrictEqual(['type1', 'type2'])

      const storageModel = collectionDetails.viewmodel.attributes.find(attr => attr.label === 'Storage:')
      expect(storageModel.value).toStrictEqual(['10 degrees'])

      const dataModel = collectionDetails.viewmodel.attributes.find(attr => attr.label === 'Data:')
      expect(dataModel.value).toStrictEqual(['One type'])

      const diagnosisModel = collectionDetails.viewmodel.attributes.find(attr => attr.label === 'Diagnosis:')
      expect(diagnosisModel.value).toStrictEqual(['Common cold', 'Mysterious illness', 'Instaneous death'])
    })
  })

  describe('mapRange', () => {
    it('should age range below max age', () => {
      const actual = mapRange(undefined, 20, [{ label: 'years' }])
      expect(actual).toBe('< 20 years')
    })

    it('should age range above min age', () => {
      const actual = mapRange(0, undefined, [{ label: 'years' }])
      expect(actual).toBe('> 0 years')
    })

    it('should age range between ages', () => {
      const actual = mapRange(0, 20, [{ label: 'years' }])
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

  describe('getCollectionDetails', () => {
    it('should add details for collection and for sub collections', () => {
      const expected = {
        attributes: [
          {
            label: 'Id:',
            linkValue: 'c-001',
            type: 'string',
            value: 'c-001'
          },
          {
            label: 'Website:',
            type: 'hyperlink',
            value: ''
          },
          {
            label: 'Quality labels:',
            type: 'quality',
            value: [
              {
                label: 'Order of the rose'
              }
            ]
          },
          {
            label: 'Size:',
            type: 'object',
            value: '777'
          },
          {
            label: 'Available:',
            type: 'int',
            value: ''
          },
          {
            label: 'Donor size:',
            type: 'object',
            value: ''
          },
          {
            label: 'Donors:',
            type: 'int',
            value: ''
          },
          {
            label: 'Age:',
            type: 'range',
            value: '0-20 years'
          },
          {
            label: 'Type:',
            type: 'mref',
            value: [
              'type1',
              'type2'
            ]
          },
          {
            label: 'Sex:',
            type: 'categoricalmref',
            value: [
              'male',
              'female'
            ]
          },
          {
            label: 'Materials:',
            type: 'categoricalmref',
            value: [
              'material1',
              'material2'
            ]
          },
          {
            label: 'Storage:',
            type: 'categoricalmref',
            value: [
              '10 degrees'
            ]
          },
          {
            label: 'Data:',
            type: 'categoricalmref',
            value: [
              'One type'
            ]
          },
          {
            label: 'Diagnosis:',
            type: 'mref',
            value: [
              'Common cold',
              'Mysterious illness',
              'Instaneous death'
            ]
          },
          {
            label: 'Data use conditions:',
            type: 'mref',
            value: [
              {
                label: 'DUO Testlabel',
                uri: 'https://external-link-to-duo-item'
              },
              {
                label: 'DUO Testlabel',
                uri: ''
              }
            ]
          }
        ],
        sub_collections: [
          {
            data_categories: [
              {
                id: 'BIOLOGICAL_SAMPLES',
                label: 'Biological samples'
              }
            ],
            description: 'Description of test1',
            id: '1',
            level: 1,
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
            sub_collections: [],
            viewmodel: {
              attributes: [
                {
                  label: 'Id:',
                  linkValue: '1',
                  type: 'string',
                  value: '1'
                },
                {
                  label: 'Website:',
                  type: 'hyperlink',
                  value: ''
                },
                {
                  label: 'Quality labels:',
                  type: 'quality',
                  value: undefined
                },
                {

                  label: 'Size:',
                  type: 'object',
                  value: '10.000 - 100.000'
                },
                {
                  label: 'Available:',
                  type: 'int',
                  value: ''
                },
                {
                  label: 'Donor size:',
                  type: 'object',
                  value: ''
                },
                {
                  label: 'Donors:',
                  type: 'int',
                  value: ''
                },
                {
                  label: 'Age:',
                  type: 'range',
                  value: ''
                },
                {
                  label: 'Type:',
                  type: 'mref',
                  value: []
                },
                {
                  label: 'Sex:',
                  type: 'categoricalmref',
                  value: []
                },
                {

                  label: 'Materials:',
                  type: 'categoricalmref',
                  value: [
                    'Other'
                  ]
                },
                {
                  label: 'Storage:',
                  type: 'categoricalmref',
                  value: []
                },
                {

                  label: 'Data:',
                  type: 'categoricalmref',
                  value: [
                    'Biological samples'
                  ]
                },
                {
                  label: 'Diagnosis:',
                  type: 'mref',
                  value: []
                },
                {
                  label: 'Data use conditions:',
                  type: 'mref',
                  value: []
                }
              ]
            }
          },
          {
            data_categories: [
              {
                id: 'BIOLOGICAL_SAMPLES',
                label: 'Biological samples'
              }
            ],
            id: '2',
            level: 2,
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
            ],
            viewmodel: {
              attributes: [
                {
                  label: 'Id:',
                  linkValue: '2',
                  type: 'string',
                  value: '2'
                },
                {
                  label: 'Website:',
                  type: 'hyperlink',
                  value: ''
                },
                {
                  label: 'Quality labels:',
                  type: 'quality',
                  value: undefined
                },
                {

                  label: 'Size:',
                  type: 'object',
                  value: '10.000 - 100.000'
                },
                {
                  label: 'Available:',
                  type: 'int',
                  value: ''
                },
                {
                  label: 'Donor size:',
                  type: 'object',
                  value: ''
                },
                {
                  label: 'Donors:',
                  type: 'int',
                  value: ''
                },
                {
                  label: 'Age:',
                  type: 'range',
                  value: ''
                },
                {
                  label: 'Type:',
                  type: 'mref',
                  value: []
                },
                {
                  label: 'Sex:',
                  type: 'categoricalmref',
                  value: []
                },
                {

                  label: 'Materials:',
                  type: 'categoricalmref',
                  value: [
                    'Other'
                  ]
                },
                {
                  label: 'Storage:',
                  type: 'categoricalmref',
                  value: []
                },
                {

                  label: 'Data:',
                  type: 'categoricalmref',
                  value: [
                    'Biological samples'
                  ]
                },
                {
                  label: 'Diagnosis:',
                  type: 'mref',
                  value: []
                },
                {
                  label: 'Data use conditions:',
                  type: 'mref',
                  value: []
                }
              ],
              sub_collections: [
                {
                  id: '3',
                  level: 2,
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
                  sub_collections: [],
                  viewmodel: {
                    attributes: [
                      {
                        label: 'Id:',
                        linkValue: '3',
                        type: 'string',
                        value: '3'
                      },
                      {
                        label: 'Website:',
                        type: 'hyperlink',
                        value: ''
                      },
                      {
                        label: 'Quality labels:',
                        type: 'quality',
                        value: undefined
                      },
                      {

                        label: 'Size:',
                        type: 'object',
                        value: '10.000 - 100.000'
                      },
                      {
                        label: 'Available:',
                        type: 'int',
                        value: ''
                      },
                      {
                        label: 'Donor size:',
                        type: 'object',
                        value: ''
                      },
                      {
                        label: 'Donors:',
                        type: 'int',
                        value: ''
                      },
                      {
                        label: 'Age:',
                        type: 'range',
                        value: ''
                      },
                      {
                        label: 'Type:',
                        type: 'mref',
                        value: []
                      },
                      {
                        label: 'Sex:',
                        type: 'categoricalmref',
                        value: []
                      },
                      {

                        label: 'Materials:',
                        type: 'categoricalmref',
                        value: [
                          'Other'
                        ]
                      },
                      {
                        label: 'Storage:',
                        type: 'categoricalmref',
                        value: []
                      },
                      {
                        label: 'Data:',
                        type: 'categoricalmref',
                        value: []
                      },
                      {
                        label: 'Diagnosis:',
                        type: 'mref',
                        value: []
                      },
                      {
                        label: 'Data use conditions:',
                        type: 'mref',
                        value: []
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }

      const actual = getCollectionDetails(collectionsReport)
      expect(actual.viewmodel).toStrictEqual(expected)
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
        name: { value: '', type: 'string' },
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
        first_name: 'first',
        last_name: 'last',
        role: 'role'
      }
      const actual = getNameOfHead(element)
      expect(actual).toBe('first last (role)')
    })

    it('should map last name and role', () => {
      const element = {
        last_name: 'last',
        role: 'role'
      }
      const actual = getNameOfHead(element)
      expect(actual).toBe('last (role)')
    })

    it('should return first and last name', () => {
      const element = {
        first_name: 'first',
        last_name: 'last'
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

  describe('getViewmodel', () => {
    it('adds linkValue attribute when showLink is present', () => {
      const config = [{ label: 'PID', column: 'pid', type: 'string', showCopyIcon: true }]
      const expected = { attributes: [{ label: 'PID', type: 'string', value: '123', linkValue: '123' }] }
      const actual = getViewmodel({ pid: '123' }, config)
      expect(actual).toEqual(expected)
    })

    it('adds a prefix to the linkValue when copyValuePrefix is present', () => {
      const config = [{ label: 'PID', column: 'pid', type: 'string', showCopyIcon: true, copyValuePrefix: 'http://prefix/' }]
      const expected = { attributes: [{ label: 'PID', type: 'string', value: '123', linkValue: 'http://prefix/123' }] }
      const actual = getViewmodel({ pid: '123' }, config)
      expect(actual).toEqual(expected)
    })
  })
})
