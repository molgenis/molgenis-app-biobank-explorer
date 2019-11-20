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
      age_low: 0,
      age_unit: 'years',
      type: [{label: 'type1'}, {label: 'type2'}],
      sex: [{label: 'male'}, {label: 'female'}],
      materials: [{label: 'material1'}, {label: 'material2'}],
      storage_temperatures: [{label: '10 degrees'}],
      data_categories: [{label: 'One type'}],
      diagnosis_available: [{label: 'Common cold'}, {label: 'Mysterious illness'}, {label: 'Instaneous death'}],
      head_lastname: 'Thermopolis Renaldi',
      head_firstname: 'Amelia Mignonette',
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
  })

  it('should initialize component', () => {
    const wrapper = shallowMount(CollectionReportCard, {mocks, stubs, store})
    expect(wrapper.html()).to.have.string('<div class="container mg-collection-report-card">')
  })

  describe('methods', () => {
    describe('showThisAttribute', () => {
      it('should toggle the CollectionReportCard boolean', () => {
        const wrapper = shallowMount(CollectionReportCard, {mocks, stubs, store})
        console.log(wrapper)
        expect(wrapper.vm.descriptionClosed).to.equal(true)
        wrapper.vm.toggleDescription()
        expect(wrapper.vm.descriptionClosed).to.equal(false)
      })
    })
  })
})
