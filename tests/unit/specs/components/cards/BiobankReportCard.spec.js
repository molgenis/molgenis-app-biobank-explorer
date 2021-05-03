import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import BiobankReportCard from '@/components/cards/BiobankReportCard'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('BiobankReportCard', () => {
  let store
  let mocks
  let stubs
  let biobankReport

  beforeEach(() => {
    biobankReport = {
      collections: [],
      contact: {
        first_name: 'first_name',
        last_name: 'last_name',
        email: 'email',
        phone: 'phone',
        country: {
          id: 'NL',
          name: 'Netherlands'
        },
        address: 'address',
        city: 'city',
        zip: 'zip'
      },
      network: [
        { id: 'n01', name: 'Network 01' },
        { id: 'n02', name: 'Network 02' }
      ],
      country: {
        name: 'name'
      }
    }

    store = new Vuex.Store({
      state: {
        isLoading: false,
        biobankReport,
        route: {
          params: {
            id: 'my-id'
          }
        }
      },
      actions: {
        GetBiobankReport: () => {}
      }
    })
    mocks = {
      $route: {
        query: 'some-query'
      }
    }
    stubs = ['router-link', 'router-view']
  })

  it('should initialize component', () => {
    const wrapper = shallowMount(BiobankReportCard, { mocks, stubs, store, localVue })
    expect(wrapper.html()).toContain('class="mg-biobank-card container"')
  })

  describe('computed', () => {
    describe('query', () => {
      it('should get query', () => {
        const wrapper = shallowMount(BiobankReportCard, { mocks, stubs, store, localVue })
        expect(wrapper.vm.query).toEqual('some-query')
      })

      it('should expose a list of covid19 types if available', () => {
        biobankReport.covid19biobank = [{ label: 'Member of the COVID-19 network' }, { name: 'COVID-19' }]
        const wrapper = shallowMount(BiobankReportCard, { mocks, stubs, store, localVue })
        expect(wrapper.vm.availableCovidTypes).toStrictEqual({
          Covid19: {
            badgeColor: 'warning',
            type: 'list',
            value: [
              'Member of the COVID-19 network',
              'COVID-19'
            ]
          }
        })
      })
    })

    describe('collectionsData', () => {
      it('should fill collectionsData if available', () => {
        const wrapper = shallowMount(BiobankReportCard, { mocks, stubs, store, localVue })
        expect(wrapper.vm.collectionsData).toStrictEqual([])
      })

      it('should return empty array', () => {
        store.state.biobankReport = undefined
        const wrapper = shallowMount(BiobankReportCard, { mocks, stubs, store, localVue })
        expect(wrapper.vm.collectionsData).toStrictEqual([])
      })
    })

    describe('contact', () => {
      it('should fill contact', () => {
        const wrapper = shallowMount(BiobankReportCard, { mocks, stubs, store, localVue })
        expect(wrapper.vm.contact.email).toStrictEqual({ value: 'email', type: 'email' })
      })

      it('should return empty object', () => {
        store.state.biobankReport = undefined
        const wrapper = shallowMount(BiobankReportCard, { mocks, stubs, store, localVue })
        expect(wrapper.vm.contact).toStrictEqual({})
      })
    })

    describe('networks', () => {
      it('should fill networks', () => {
        const wrapper = shallowMount(BiobankReportCard, { mocks, stubs, store, localVue })
        expect(wrapper.vm.networks.length).toEqual(2)
      })

      it('should return empty array', () => {
        store.state.biobankReport = undefined
        const wrapper = shallowMount(BiobankReportCard, { mocks, stubs, store, localVue })
        expect(wrapper.vm.networks).toStrictEqual([])
      })
    })
  })
})
