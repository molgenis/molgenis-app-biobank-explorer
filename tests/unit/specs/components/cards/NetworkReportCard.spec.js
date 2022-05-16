import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import NetworkReportCard from '@/components/cards/NetworkReportCard'
import { baseGetters } from '../../mockData'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('NetworkReportCard', () => {
  let store
  let stubs
  let mocks
  let networkReport

  beforeEach(() => {
    networkReport = {
      network: {
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
        GetNetworkReport: () => { }
      },
      getters: {
        ...baseGetters
      }
    })
    mocks = {
      $route: {
        fullPath: '/network/n-001'
      }
    }
    stubs = ['router-link', 'router-view', 'b-tab', 'b-tabs', 'b-badge']
  })

  it('should initialize component', () => {
    const wrapper = shallowMount(NetworkReportCard, { mocks, stubs, store, localVue })
    expect(wrapper.html()).toContain('class="container mg-network-report-card"')
  })

  describe('computed', () => {
    describe('networkId', () => {
      it('computes the network id based on URL', () => {
        const wrapper = shallowMount(NetworkReportCard, { mocks, stubs, store, localVue })
        expect(wrapper.vm.networkId).toEqual('n-001')
      })
    })

    describe('contact', () => {
      it('should fill contact', () => {
        const wrapper = shallowMount(NetworkReportCard, { mocks, stubs, store, localVue })
        expect(wrapper.vm.contact.email).toStrictEqual({ value: 'blaat@bla.nl', type: 'email' })
      })
    })

    describe('detailsContent', () => {
      it('should fill detailsContent', () => {
        const wrapper = shallowMount(NetworkReportCard, { mocks, stubs, store, localVue })
        expect(wrapper.vm.detailsContent['Common collection focus'].value).toEqual(true)
        expect(wrapper.vm.detailsContent['Common charter'].value).toEqual(true)
        expect(wrapper.vm.detailsContent['Common SOPS'].value).toEqual(false)
        expect(wrapper.vm.detailsContent['Data access policy'].value).toEqual(true)
        expect(wrapper.vm.detailsContent['Sample access policy'].value).toEqual(false)
        expect(wrapper.vm.detailsContent['Common MTA'].value).toEqual(true)
        expect(wrapper.vm.detailsContent['Common image access policy'].value).toEqual(false)
        expect(wrapper.vm.detailsContent['Common image MTA'].value).toEqual(false)
        expect(wrapper.vm.detailsContent['Common representation'].value).toEqual(true)
        expect(wrapper.vm.detailsContent['Common URL'].value).toEqual(true)
      })
    })
  })
})
