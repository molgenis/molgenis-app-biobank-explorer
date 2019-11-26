/* global describe it expect beforeEach */
import { shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import NetworkReportCard from '@/components/cards/NetworkReportCard'

describe('CollectionReportCard', () => {
  let store
  let stubs
  let mocks
  let networkReport

  beforeEach(() => {
    networkReport = {
      _meta: {
        name: 'meta'
      },
      id: 'n-001',
      name: 'beautiful network',
      description: 'beautiful collections and biobanks',
      contact: {
        email: 'blaat@bla.nl'
      },
      juridical_person: 'something',
      url: 'https://blaat.nl',
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

    store = new Vuex.Store({
      state: {
        networkReport,
        isLoading: false,
        route: {
          params: {
            id: 'my-id'
          }
        }
      },
      actions: {
        '__GET_NETWORK_REPORT__': () => {}
      }
    })
    mocks = {
      $route: {
        fullPath: '/network/report/n-001'
      }
    }
    stubs = ['router-link', 'router-view']
  })

  it('should initialize component', () => {
    const wrapper = shallowMount(NetworkReportCard, {mocks, stubs, store})
    expect(wrapper.html()).to.have.string('class="container mg-network-report-card"')
  })

  describe('computed', () => {
    describe('networkId', () => {
      it('computes the network id based on URL', () => {
        const wrapper = shallowMount(NetworkReportCard, {mocks, stubs, store})
        expect(wrapper.vm.networkId).to.equal('n-001')
      })
    })

    describe('contact', () => {
      it('should fill contact', () => {
        const wrapper = shallowMount(NetworkReportCard, {mocks, stubs, store})
        expect(wrapper.vm.contact.email).to.deep.equal({'value': 'blaat@bla.nl', type: 'email'})
      })
    })

    describe('detailsTableContent', () => {
      it('should fill detailsTableContent', () => {
        const wrapper = shallowMount(NetworkReportCard, {mocks, stubs, store})
        expect(wrapper.vm.detailsTableContent.listValues['Common collection focus'].values[0]).to.equal('Yes')
        expect(wrapper.vm.detailsTableContent.listValues['Common charter'].values[0]).to.equal('Yes')
        expect(wrapper.vm.detailsTableContent.listValues['Common SOPS'].values[0]).to.equal('No')
        expect(wrapper.vm.detailsTableContent.listValues['Data access policy'].values[0]).to.equal('Yes')
        expect(wrapper.vm.detailsTableContent.listValues['Sample access policy'].values[0]).to.equal('No')
        expect(wrapper.vm.detailsTableContent.listValues['Common MTA'].values[0]).to.equal('Yes')
        expect(wrapper.vm.detailsTableContent.listValues['Common image access policy'].values[0]).to.equal('No')
        expect(wrapper.vm.detailsTableContent.listValues['Common image MTA'].values[0]).to.equal('No')
        expect(wrapper.vm.detailsTableContent.listValues['Common representation'].values[0]).to.equal('Yes')
        expect(wrapper.vm.detailsTableContent.listValues['Common URL'].values[0]).to.equal('Yes')
      })
    })
  })
})
