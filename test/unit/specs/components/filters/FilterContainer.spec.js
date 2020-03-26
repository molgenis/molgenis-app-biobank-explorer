/* global describe it expect */
import FilterContainer from '@/components/filters/FilterContainer'
import Vuex from 'vuex'
import { shallowMount, createLocalVue } from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('FilterContainer', () => {
  let wrapper
  let store

  describe('filters', () => {
    it('should include the country filters if showCountryFacet is set to true', () => {
      store = new Vuex.Store({
        state: {
          route: {
            query: ''
          },
          items: [],
          country: {
            filters: [],
            options: []
          },
          materials: {
            filters: [],
            options: []
          },
          collection_quality: {
            filters: [],
            options: [],
            collections: []
          },
          biobank_quality: {
            filters: [],
            options: [],
            biobanks: []
          },
          diagnosis_available: {
            filters: [],
            options: []
          },
          type: {
            filters: [],
            options: []
          },
          dataType: {
            filters: [],
            options: []
          },
          covid19: {
            filters: [],
            options: []
          }
        },
        actions: {
          __GET_COUNTRY_OPTIONS__: () => '',
          __GET_MATERIALS_OPTIONS__: () => '',
          __GET_COLLECTION_QUALITY_OPTIONS__: () => '',
          __GET_BIOBANK_QUALITY_OPTIONS__: () => '',
          __GET_TYPES_OPTIONS__: () => '',
          __GET_DATA_TYPE_OPTIONS__: () => ''
        },
        mutations: {},
        getters: {
          getMaterialOptions: () => [],
          getCountryOptions: () => [],
          getBiobankQualityOptions: () => [],
          getCollectionQualityOptions: () => [],
          getTypesOptions: () => [],
          getDataTypeOptions: () => [],
          showCountryFacet: () => true
        }
      })
      wrapper = shallowMount(FilterContainer, {store})
      expect(wrapper.vm.filters.length).eq(6)
      expect(wrapper.vm.filters.find((filter) => filter.name === 'country').name).eq('country')
    })

    it('should exclude the country filters if showCountryFacet is set to false', () => {
      store = new Vuex.Store({
        state: {
          route: {
            query: ''
          },
          items: [],
          country: {
            filters: [],
            options: []
          },
          materials: {
            filters: [],
            options: []
          },
          collection_quality: {
            filters: [],
            options: [],
            collections: []
          },
          biobank_quality: {
            filters: [],
            options: [],
            biobanks: []
          },
          diagnosis_available: {
            filters: [],
            options: []
          },
          type: {
            filters: [],
            options: []
          },
          dataType: {
            filters: [],
            options: []
          },
          covid19: {
            filters: [],
            options: []
          }
        },
        actions: {
          __GET_COUNTRY_OPTIONS__: () => '',
          __GET_MATERIALS_OPTIONS__: () => '',
          __GET_COLLECTION_QUALITY_OPTIONS__: () => '',
          __GET_BIOBANK_QUALITY_OPTIONS__: () => '',
          __GET_TYPES_OPTIONS__: () => '',
          __GET_DATA_TYPE_OPTIONS__: () => ''
        },
        mutations: {},
        getters: {
          getMaterialOptions: () => [],
          getCountryOptions: () => [],
          getBiobankQualityOptions: () => [],
          getCollectionQualityOptions: () => [],
          getTypesOptions: () => [],
          getDataTypeOptions: () => [],
          showCountryFacet: () => false
        }
      })
      wrapper = shallowMount(FilterContainer, {store})
      expect(wrapper.vm.filters.length).eq(5)
      expect(wrapper.vm.filters.find((filter) => filter.name === 'country')).eq(undefined)
    })
  })
})
