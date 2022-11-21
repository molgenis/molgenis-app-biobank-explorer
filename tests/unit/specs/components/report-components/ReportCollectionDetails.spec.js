import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import ReportCollectionDetails from '../../../../../src/components/report-components/ReportCollectionDetails'

import { mockState } from '../../mockData'

const localVue = createLocalVue()
localVue.use(Vuex)

let collection, store

const expected = {
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
  ],
  viewmodel: {
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
        value: undefined
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
        value: []
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
    ],
    sub_collections: [
      {
        data_categories: [
          {
            id: 'BIOLOGICAL_SAMPLES',
            label: 'Biological samples'
          }
        ],
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
        level: 1,
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
        sub_collections: [],
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
          ]
        }
      }
    ]
  }
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
    describe('collectionModel', () => {
      it('should return an object with badgeColor properties for both collection and subcollections', () => {
        const wrapper = shallowMount(ReportCollectionDetails, { store, localVue, propsData: { collection } })
        expect(wrapper.vm.collectionModel).toStrictEqual(expected)
      })
    })
    describe('isTopLevelCollection', () => {
      it('should return true if parent_collection is not defined on the collection', () => {
        const wrapper = shallowMount(ReportCollectionDetails, { store, localVue, propsData: { collection } })
        expect(wrapper.vm.isTopLevelCollection).toBeTruthy()
      })
    })
  })
})
