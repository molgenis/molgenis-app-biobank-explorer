/* global describe it expect beforeEach */
import { shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import CollectionReportCard from '@/components/cards/CollectionReportCard'

describe('CollectionReportCard', () => {
  let store
  let stubs
  let mocks
  let collectionReport
  let wrapper

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
    wrapper = shallowMount(CollectionReportCard, {mocks, stubs, store})
  })

  it('should initialize component', () => {
    expect(wrapper.html()).to.have.string('<div class="container mg-collection-report-card">')
  })
})
