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
