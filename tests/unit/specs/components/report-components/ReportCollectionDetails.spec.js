import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import ReportCollectionDetails from '../../../../../src/components/report-components/ReportCollectionDetails'

import { mockState } from '../../mockData'

const localVue = createLocalVue()
localVue.use(Vuex)

let collection, store

const expected = {
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
    value: []
  },
  Sex: {
    value: []
  },
  Size: {
    badgeColor: 'success',
    type: 'list',
    value: ['777']
  },
  Storage_temperatures: {
    value: []
  },
  Type: {
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
      sub_collections: []
    }
  ]
}

describe('ReportCollectionDetails', () => {
  beforeEach(() => {
    store = new Vuex.Store({
      state: mockState()
    })

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
        const wrapper = shallowMount(ReportCollectionDetails, { store, localVue, propsData: { collection } })
        expect(wrapper.vm.mainContent).toStrictEqual(expected)
      })
    })
    describe('isTopLevelCollection', () => {
      it('should return true if parent_collection is not defined on the collection', () => {
        const wrapper = shallowMount(ReportCollectionDetails, { store, localVue, propsData: { collection } })
        expect(wrapper.vm.isTopLevelCollection).toBeTruthy()
      })
    })

    describe('BadgeColor Generator', () => {
      it('should not return two the same colors', () => {
        const wrapper = shallowMount(ReportCollectionDetails, { store, localVue, propsData: { collection } })

        const colors = []
        for (let i = 0; i < 5; i++) {
          colors.push(wrapper.vm.generateBadgeColor())
        }

        const colorCount = colors.length
        const distinctCount = [...new Set(colors)].length

        expect(colorCount).toEqual(distinctCount)
      })
    })
  })
})
