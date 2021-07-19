import { shallowMount } from '@vue/test-utils'
import ReportCollectionDetails from '../../../../../src/components/report-components/ReportCollectionDetails'

let collection

const expected = {
  Age: {
    type: 'string-with-key',
    value: undefined
  },
  Data: {
    badgeColor: 'info',
    type: 'list',
    value: []
  },
  DataUse: {
    badgeColor: 'success',
    type: 'list',
    value: []
  },
  Diagnosis: {
    badgeColor: 'primary',
    type: 'list',
    value: []
  },
  Materials: {
    badgeColor: 'danger',
    type: 'list',
    value: []
  },
  Sex: {
    badgeColor: 'secondary',
    type: 'list',
    value: []
  },
  Size: {
    badgeColor: 'success',
    type: 'list',
    value: ['777']
  },
  Storage: {
    badgeColor: 'warning',
    type: 'list',
    value: []
  },
  Type: {
    badgeColor: 'info',
    type: 'list',
    value: []
  },
  _meta: {
    name: 'meta'
  },
  biobank: {
    email: 'info@beautiful-biobank.gnv',
    id: 'b-001',
    juridical_person: 'Is this even a person?',
    name: 'beautiful biobank',
    url: 'https://beautiful-biobank.gnv'
  },
  country: {
    name: 'Genovia'
  },
  description: 'beautiful samples',
  id: 'c-001',
  name: 'beautiful collection',
  network: [
    {
      id: 'network-x',
      name: 'Network x'
    },
    {
      id: 'network-y',
      name: 'Network y'
    }
  ],
  order_of_magnitude: {
    _href: '/api/v2/eu_bbmri_eric_biobank_size/3',
    size: '777'
  },
  sub_collections: [
    {
      Age: {
        type: 'string-with-key',
        value: undefined
      },
      Data: {
        badgeColor: 'info',
        type: 'list',
        value: [
          'Biological samples'
        ]
      },
      DataUse: {
        badgeColor: 'success',
        type: 'list',
        value: []
      },
      Diagnosis: {
        badgeColor: 'primary',
        type: 'list',
        value: []
      },
      Materials: {
        badgeColor: 'danger',
        type: 'list',
        value: [
          'Other'
        ]
      },
      Sex: {
        badgeColor: 'secondary',
        type: 'list',
        value: []
      },
      Size: {
        badgeColor: 'success',
        type: 'list',
        value: [
          '10.000 - 100.000'
        ]
      },
      Storage: {
        badgeColor: 'warning',
        type: 'list',
        value: []
      },
      Type: {
        badgeColor: 'info',
        type: 'list',
        value: []
      },
      data_categories: [
        {
          id: 'BIOLOGICAL_SAMPLES',
          label: 'Biological samples'
        }
      ],
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
      Data: {
        badgeColor: 'info',
        type: 'list',
        value: [
          'Biological samples'
        ]
      },
      DataUse: {
        badgeColor: 'success',
        type: 'list',
        value: []
      },
      Diagnosis: {
        badgeColor: 'primary',
        type: 'list',
        value: []
      },
      Materials: {
        badgeColor: 'danger',
        type: 'list',
        value: [
          'Other'
        ]
      },
      Sex: {
        badgeColor: 'secondary',
        type: 'list',
        value: []
      },
      Size: {
        badgeColor: 'success',
        type: 'list',
        value: [
          '10.000 - 100.000'
        ]
      },
      Storage: {
        badgeColor: 'warning',
        type: 'list',
        value: []
      },
      Type: {
        badgeColor: 'info',
        type: 'list',
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
      sub_collections: []
    }
  ]
}

describe('ReportCollectionDetails', () => {
  beforeEach(() => {
    collection = {
      _meta: {
        name: 'meta'
      },
      id: 'c-001',
      name: 'beautiful collection',
      description: 'beautiful samples',
      sub_collections: [
        {
          id: '1',
          materials: [{ id: 'OTHER', label: 'Other' }],
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
          sub_collections: []
        }
      ],
      order_of_magnitude: {
        _href: '/api/v2/eu_bbmri_eric_biobank_size/3',
        size: '777'
      },
      country: {
        name: 'Genovia'
      },
      network: [
        {
          id: 'network-x',
          name: 'Network x'
        },
        {
          id: 'network-y',
          name: 'Network y'
        }
      ],
      biobank: {
        id: 'b-001',
        name: 'beautiful biobank',
        juridical_person: 'Is this even a person?',
        email: 'info@beautiful-biobank.gnv',
        url: 'https://beautiful-biobank.gnv'
      }
    }
  })
  describe('computed', () => {
    describe('mainContent', () => {
      it('should return an object with badgeColor properties for both collection and subcollections', () => {
        const wrapper = shallowMount(ReportCollectionDetails, { propsData: { collection } })
        expect(wrapper.vm.mainContent).toStrictEqual(expected)
      })
    })
    describe('isTopLevelCollection', () => {
      it('should return true if parent_collection is not defined on the collection', () => {
        const wrapper = shallowMount(ReportCollectionDetails, { propsData: { collection } })
        expect(wrapper.vm.isTopLevelCollection).toBeTruthy()
      })
    })
  })
})
