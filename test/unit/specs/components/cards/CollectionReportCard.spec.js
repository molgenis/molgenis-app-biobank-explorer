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

  describe('computed', () => {
    describe('detailsTableContent', () => {
      it('should generate stringValues of details table content', () => {
        expect(wrapper.vm.detailsTableContent.stringValues.Size).to.equal('666 participants')
        expect(wrapper.vm.detailsTableContent.stringValues.Age).to.equal('0-20 years')
      })

      it('should generate listValues of details table content', () => {
        expect(wrapper.vm.detailsTableContent.listValues.Type.values).to.deep.equal(['type1', 'type2'])
        expect(wrapper.vm.detailsTableContent.listValues.Storage.values).to.deep.equal(['10 degrees'])
        expect(wrapper.vm.detailsTableContent.listValues.Data.values).to.deep.equal(['One type'])
        expect(wrapper.vm.detailsTableContent.listValues.Diagnosis.values).to.deep.equal(['Common cold', 'Mysterious illness', 'Instaneous death'])
      })
    })

    describe('detailsListContent', () => {
      it('should generate contact of detailsListContent', () => {
        expect(wrapper.vm.detailsListContent.contact.name.value).to.equal('Amelia Mignonette Thermopolis Renaldi (Princess of Genovia) ')
        expect(wrapper.vm.detailsListContent.contact.email.value).to.equal('mia@genovia.gnv')
        expect(wrapper.vm.detailsListContent.contact.phone.value).to.equal('+66 123456789')
      })

      it('should generate quality of detailsListContent', () => {
        expect(wrapper.vm.detailsListContent.quality['Partner charter']).to.deep.equal({value: true, type: 'bool'})
        expect(wrapper.vm.detailsListContent.quality.Certification).to.deep.equal({
          value: ['Order of the rose'],
          type: 'list'
        })
      })

      it('should generate collaboration of detailsListContent', () => {
        expect(wrapper.vm.detailsListContent.collaboration['Not for profit']).to.deep.equal({value: true, type: 'bool'})
        expect(wrapper.vm.detailsListContent.collaboration.Commercial).to.deep.equal({value: false, type: 'bool'})
      })
    })
  })
})
