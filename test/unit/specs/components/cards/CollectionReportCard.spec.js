/* global describe it expect beforeEach */
import { shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import CollectionReportCard from '@/components/cards/CollectionReportCard'

describe('CollectionReportCard', () => {
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
        route: {
          params: {
            id: 'my-id'
          }
        }
      },
      actions: {
        '__GET_COLLECTION_REPORT__': () => {}
      }
    })
    mocks = {
      $route: {
        fullPath: '/biobank/report/b-001'
      }
    }
    stubs = ['router-link', 'router-view']
  })

  it('should initialize component', () => {
    const wrapper = shallowMount(CollectionReportCard, {mocks, stubs, store})
    expect(wrapper.html()).to.have.string('<div class="container mg-collection-report-card">')
  })

  describe('computed', () => {
    describe('subCollections', () => {
      it('computes empty array for empty subCollections', () => {
        const wrapper = shallowMount(CollectionReportCard, {mocks, stubs, store})
        expect(wrapper.vm.subCollections).to.deep.equal([])
      })
      it('computes array with subCollections', () => {
        store.state.collectionReport.sub_collections = [
          {
            id: '1',
            materials: [{id: 'OTHER', label: 'Other'}],
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
            sub_collections: []
          }
        ]

        const wrapper = shallowMount(CollectionReportCard, {mocks, stubs, store})
        const expected = [
          {
            description: undefined,
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
            subCollections: [],
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
        expect(wrapper.vm.subCollections).to.deep.equal(expected)
      })
    })
  })
})
