import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import CollectionReport from '@/views/CollectionReport'
import { baseGetters } from '../mockData'

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
        _href: '/api/v2/eu_bbmri_eric_biobank_size/3',
        size: '777'
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
        GetCollectionReport: () => { }
      },
      getters: {
        ...baseGetters,
        selectedCollections: jest.fn().mockReturnValue([])
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
    expect(wrapper.html()).toContain('class="container mg-collection-report-card')
  })

  describe('computed', () => {
    describe('collectionId', () => {
      it('computes the collection id based on URL', () => {
        const wrapper = shallowMount(CollectionReport, { mocks, stubs, store, localVue })
        expect(wrapper.vm.collectionId).toBe('c-001')
      })
    })
  })

  describe('bioschemas', () => {
    it('should add bioschemas data', () => {
      const wrapper = shallowMount(CollectionReport, { mocks, stubs, store, localVue })
      expect(wrapper.vm.bioschemasJsonld['@context']).toStrictEqual('https://schema.org')
      expect(wrapper.vm.bioschemasJsonld['@type']).toStrictEqual('Dataset')
      expect(wrapper.vm.bioschemasJsonld['@id']).toStrictEqual('http://localhost/#/collection/c-001')
      expect(wrapper.html()).toContain('<script type="application/ld+json">')
      expect(wrapper.html()).toContain('"@context": "https://schema.org",')
    })

    it('should add bioschemas data', () => {
      store.state.collectionReport = undefined
      const wrapper = shallowMount(CollectionReport, { mocks, stubs, store, localVue })
      expect(wrapper.vm.bioschemasJsonld).toStrictEqual(undefined)
      expect(wrapper.html()).not.toContain('<script type="application/ld+json">')
    })
  })
})
