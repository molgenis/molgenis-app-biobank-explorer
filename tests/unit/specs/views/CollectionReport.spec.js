import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import CollectionReport from '@/views/CollectionReport'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('CollectionReport', () => {
  let store
  let stubs
  let mocks
  let collectionReport

  beforeEach(() => {
    collectionReport = {
      _meta: {
        name: 'meta'
      },
      id: 'c-001',
      name: 'beautiful collection',
      description: 'beautiful samples',
      order_of_magnitude: {
        size: '666'
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

    store = new Vuex.Store({
      state: {
        collectionReport,
        isLoading: false,
        route: {
          params: {
            id: 'my-id'
          }
        }
      },
      actions: {
        GetCollectionReport: () => {}
      }
    })
    mocks = {
      $route: {
        fullPath: '/collection/c-001'
      }
    }
    stubs = ['router-link', 'router-view']
  })

  it('should initialize component', () => {
    const wrapper = shallowMount(CollectionReport, { mocks, stubs, store, localVue })
    expect(wrapper.html()).toContain('class="container mg-collection-report-card"')
  })

  describe('computed', () => {
    describe('mainContent', () => {
      it('should return empty object', () => {
        store.state.collectionReport = undefined
        const wrapper = shallowMount(CollectionReport, { mocks, stubs, store, localVue })
        expect(wrapper.vm.mainContent).toStrictEqual({})
      })
    })

    describe('collectionId', () => {
      it('computes the collection id based on URL', () => {
        const wrapper = shallowMount(CollectionReport, { mocks, stubs, store, localVue })
        expect(wrapper.vm.collectionId).toBe('c-001')
      })
    })

    describe('subCollections', () => {
      it('computes empty array for empty subCollections', () => {
        const wrapper = shallowMount(CollectionReport, { mocks, stubs, store, localVue })
        expect(wrapper.vm.subCollections).toStrictEqual([])
      })
      it('computes array with subCollections', () => {
        store.state.collectionReport.sub_collections = [
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
        ]

        const wrapper = shallowMount(CollectionReport, { mocks, stubs, store, localVue })
        const expected = [
          {
            description: undefined,
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
            subCollections: [],
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
        expect(wrapper.vm.subCollections).toStrictEqual(expected)
      })
    })
  })
})
