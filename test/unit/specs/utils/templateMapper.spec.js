import { expect } from 'chai'
import {
  mapDetailsTableContent,
  mapAgeRange,
  mapCollectionDetailsListContent,
  mapCollectionsData,
  mapNetworkInfo,
  mapContactInfo,
  mapNetworkData
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
    age_unit: [{label: 'years'}],
    type: [{label: 'type1'}, {label: 'type2'}],
    sex: [{label: 'male'}, {label: 'female'}],
    materials: [{label: 'material1'}, {label: 'material2'}],
    storage_temperatures: [{label: '10 degrees'}],
    data_categories: [{label: 'One type'}],
    diagnosis_available: [{label: 'Common cold'}, {label: 'Mysterious illness'}, {label: 'Instaneous death'}],
    head_lastname: 'Thermopolis Renaldi',
    head_firstname: 'Amelia Mignonette',
    head_role: 'Princess of Genovia',
    contact: {
      email: 'mia@genovia.gnv',
      phone: '+66 123456789'
    },
    sub_collections: [
      {
        id: '1',
        materials: [{id: 'OTHER', label: 'Other'}],
        description: 'Description of test1',
        name: 'Test 1',
        order_of_magnitude: {id: 4, size: '10.000 - 100.000'},
        data_categories: [{id: 'BIOLOGICAL_SAMPLES', label: 'Biological samples'}],
        parent_collection: {id: 'c-001', name: 'beautiful collection'},
        sub_collections: []
      },
      {
        id: '2',
        materials: [{id: 'OTHER', label: 'Other'}],
        name: 'Test 2',
        data_categories: [{id: 'BIOLOGICAL_SAMPLES', label: 'Biological samples'}],
        order_of_magnitude: {id: 4, size: '10.000 - 100.000'},
        parent_collection: {id: 'c-001', name: 'beautiful collection'},
        sub_collections: [
          {
            id: '3',
            materials: [{id: 'OTHER', label: 'Other'}],
            name: 'Test 3 (sub sub)',
            order_of_magnitude: {id: 4, size: '10.000 - 100.000'},
            parent_collection: {id: '2', name: 'Test 2'},
            sub_collections: []
          }
        ]
      }
    ],
    collaboration_commercial: false,
    collaboration_non_for_profit: true,
    country: {name: 'Genovia'},
    biobank: {
      id: 'b-001',
      name: 'beautiful biobank',
      juridical_person: 'Is this even a person?',
      email: 'info@beautiful-biobank.gnv',
      url: 'https://beautiful-biobank.gnv',
      partner_charter_signed: true,
      quality: [{label: 'Order of the rose'}]
    }
  }
  describe('mapDetailsTableContent', () => {
    it('should generate stringValues of details table content', () => {
      const actual = mapDetailsTableContent(collectionsReport)
      const expectedSize = '666 participants'
      expect(actual.stringValues.Size).to.equal(expectedSize)
    })

    it('should generate listValues of details table content', () => {
      const actual = mapDetailsTableContent(collectionsReport)
      expect(actual.listValues.Type.values).to.deep.equal(['type1', 'type2'])
      expect(actual.listValues.Storage.values).to.deep.equal(['10 degrees'])
      expect(actual.listValues.Data.values).to.deep.equal(['One type'])
      expect(actual.listValues.Diagnosis.values).to.deep.equal(['Common cold', 'Mysterious illness', 'Instaneous death'])
    })
  })

  describe('mapAgeRange', () => {
    it('should age range below max age', () => {
      const actual = mapAgeRange(undefined, 20, [{label: 'years'}])
      expect(actual).to.equal('< 20 years')
    })

    it('should age range above min age', () => {
      const actual = mapAgeRange(0, undefined, [{label: 'years'}])
      expect(actual).to.equal('> 0 years')
    })

    it('should age range between ages', () => {
      const actual = mapAgeRange(0, 20, [{label: 'years'}])
      expect(actual).to.equal('0-20 years')
    })
  })

  describe('detailsListContent', () => {
    it('should generate contact of detailsListContent', () => {
      const actual = mapCollectionDetailsListContent(collectionsReport)
      expect(actual.contact.name.value).to.equal('Amelia Mignonette Thermopolis Renaldi (Princess of Genovia) ')
      expect(actual.contact.email.value).to.equal('mia@genovia.gnv')
      expect(actual.contact.phone.value).to.equal('+66 123456789')
    })

    it('should generate quality of detailsListContent', () => {
      const actual = mapCollectionDetailsListContent(collectionsReport)
      expect(actual.quality['Partner charter']).to.deep.equal({value: true, type: 'bool'})
      expect(actual.quality.Certification).to.deep.equal({
        value: ['Order of the rose'],
        type: 'list'
      })
    })

    it('should generate collaboration of detailsListContent', () => {
      const actual = mapCollectionDetailsListContent(collectionsReport)
      expect(actual.collaboration['Not for profit']).to.deep.equal({value: true, type: 'bool'})
      expect(actual.collaboration.Commercial).to.deep.equal({value: false, type: 'bool'})
    })
  })

  describe('mapCollectionsData', () => {
    it('should generate details list data for sub collections', () => {
      const expected = [
        {
          description: 'Description of test1',
          parentCollection: {id: 'c-001', name: 'beautiful collection'},
          subCollections: [],
          name: 'Test 1',
          id: '1',
          tableContent: {
            stringValues: {},
            listValues: {
              Size: {
                values: ['10.000 - 100.000'],
                badgeColor: 'success'
              },
              Materials: {
                values: ['Other'],
                badgeColor: 'danger'
              },
              Data: {
                values: ['Biological samples'],
                badgeColor: 'primary'
              }
            }
          }
        },
        {
          description: undefined,
          parentCollection: {id: 'c-001', name: 'beautiful collection'},
          subCollections: [
            {
              parentCollection: {id: '2', name: 'Test 2'},
              subCollections: [],
              name: 'Test 3 (sub sub)',
              id: '3',
              description: undefined,
              tableContent: {
                stringValues: {},
                listValues: {
                  Size: {
                    values: ['10.000 - 100.000'],
                    badgeColor: 'success'
                  },
                  Materials: {
                    values: ['Other'],
                    badgeColor: 'danger'
                  },
                  Data: {
                    values: [],
                    badgeColor: 'primary'
                  }
                }
              }
            }
          ],
          name: 'Test 2',
          id: '2',
          tableContent: {
            stringValues: {},
            listValues: {
              Size: {
                values: ['10.000 - 100.000'],
                badgeColor: 'success'
              },
              Materials: {
                values: ['Other'],
                badgeColor: 'danger'
              },
              Data: {
                values: ['Biological samples'],
                badgeColor: 'primary'
              }
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
          values: ['Yes'],
          badgeColor: 'success'
        },
        'Common charter': {
          values: ['Yes'],
          badgeColor: 'success'
        },
        'Common SOPS': {
          values: ['No'],
          badgeColor: 'danger'
        },
        'Data access policy': {
          values: ['Yes'],
          badgeColor: 'success'
        },
        'Sample access policy': {
          values: ['No'],
          badgeColor: 'danger'
        },
        'Common MTA': {
          values: ['Yes'],
          badgeColor: 'success'
        },
        'Common image access policy': {
          values: ['No'],
          badgeColor: 'danger'
        },
        'Common image MTA': {
          values: ['No'],
          badgeColor: 'danger'
        },
        'Common representation': {
          values: ['Yes'],
          badgeColor: 'success'
        },
        'Common URL': {
          values: ['Yes'],
          badgeColor: 'success'
        }
      }
      const actual = mapNetworkData(network).listValues
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
        name: {value: 'Network', type: 'string'},
        report: {value: '/network/report/n', type: 'report'}
      }]
      const actual = mapNetworkInfo(data)
      expect(actual).to.deep.equal(expected)
    })
  })

  describe('mapContactInfo', () => {
    it('should map network info', () => {
      const instance = {
        url: 'https://website.com',
        contact: {email: 'email@email.com'},
        juridical_person: 'blaat',
        country: {
          name: 'Netherlands'
        }
      }
      const expected = {
        website: {value: 'https://website.com', type: 'url'},
        email: {value: 'email@email.com', type: 'email'},
        juridical_person: {value: 'blaat', type: 'string'},
        country: {value: 'Netherlands', type: 'string'}
      }
      const actual = mapContactInfo(instance)
      expect(actual).to.deep.equal(expected)
    })
  })
})
