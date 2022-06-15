import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import BiobankReport from '../../../../src/views/BiobankReport'
import { baseGetters } from '../mockData'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('BiobankReport', () => {
  let store
  let mocks
  let stubs
  let biobankReport

  beforeEach(() => {
    biobankReport = {
      id: 'b-001',
      pid: '21.12110/b-001',
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
      getters: {
        ...baseGetters
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
    const wrapper = shallowMount(BiobankReport, { mocks, stubs, store, localVue })
    expect(wrapper.html()).toContain('class="mg-biobank-card container')
  })

  describe('computed', () => {
    describe('query', () => {
      it('should get query', () => {
        const wrapper = shallowMount(BiobankReport, { mocks, stubs, store, localVue })
        expect(wrapper.vm.query).toEqual('some-query')
      })
    })

    describe('collectionsData', () => {
      it('should fill collectionsData if available', () => {
        const wrapper = shallowMount(BiobankReport, { mocks, stubs, store, localVue })
        expect(wrapper.vm.collectionsData).toStrictEqual([])
      })

      it('should return empty array', () => {
        store.state.biobankReport = undefined
        const wrapper = shallowMount(BiobankReport, { mocks, stubs, store, localVue })
        expect(wrapper.vm.collectionsData).toStrictEqual([])
      })
    })

    describe('contact', () => {
      it('should fill contact', () => {
        const wrapper = shallowMount(BiobankReport, { mocks, stubs, store, localVue })
        expect(wrapper.vm.contact.email).toStrictEqual({ value: 'email', type: 'email' })
      })

      it('should return empty object', () => {
        store.state.biobankReport = undefined
        const wrapper = shallowMount(BiobankReport, { mocks, stubs, store, localVue })
        expect(wrapper.vm.contact).toStrictEqual({})
      })
    })

    describe('networks', () => {
      it('should fill networks', () => {
        const wrapper = shallowMount(BiobankReport, { mocks, stubs, store, localVue })
        expect(wrapper.vm.networks.length).toEqual(2)
      })

      it('should return empty array', () => {
        store.state.biobankReport = undefined
        const wrapper = shallowMount(BiobankReport, { mocks, stubs, store, localVue })
        expect(wrapper.vm.networks).toStrictEqual([])
      })
    })

    describe('bioschemas', () => {
      it('should add bioschemas data', () => {
        const wrapper = shallowMount(BiobankReport, { mocks, stubs, store, localVue })
        expect(wrapper.vm.bioschemasJsonld['@context']).toStrictEqual('https://schema.org')
        expect(wrapper.vm.bioschemasJsonld['@type']).toStrictEqual('DataCatalog')
        expect(wrapper.vm.bioschemasJsonld['@id']).toStrictEqual('http://hdl.handle.net/21.12110/b-001')
        expect(wrapper.html()).toContain('<script type="application/ld+json">')
        expect(wrapper.html()).toContain('"@context": "https://schema.org",')
      })

      it('should add bioschemas data', () => {
        store.state.biobankReport = undefined
        const wrapper = shallowMount(BiobankReport, { mocks, stubs, store, localVue })
        expect(wrapper.vm.bioschemasJsonld).toStrictEqual(undefined)
        expect(wrapper.html()).not.toContain('<script type="application/ld+json">')
      })
    })
  })
})
