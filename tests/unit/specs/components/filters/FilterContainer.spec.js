import FilterContainer from '@/components/filters/FilterContainer'
import Vuex from 'vuex'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import { mockState } from '../../mockState'
import filterDefinitions from '../../../../../src/utils/filterDefinitions'
const localVue = createLocalVue()
localVue.use(Vuex)

describe('FilterContainer', () => {
  let wrapper
  let store

  describe('filters', () => {
    it('should include the country filters if showCountryFacet is set to true', () => {
      store = new Vuex.Store({
        state: mockState(),
        actions: {
          GetCountryOptions: () => '',
          GetMaterialsOptions: () => '',
          GetCollectionQualityOptions: () => '',
          GetBiobankQualityOptions: () => '',
          GetTypesOptions: () => '',
          GetDataTypeOptions: () => '',
          GetCovid19Options: () => '',
          GetBiobankNetworkOptions: () => '',
          GetBiobankQualityBiobanks: () => ''
        },
        mutations: {},
        getters: {
          getMaterialOptions: () => [],
          getCountryOptions: () => [],
          getBiobankQualityOptions: () => [],
          getCollectionQualityOptions: () => [],
          getTypesOptions: () => [],
          getDataTypeOptions: () => [],
          showCountryFacet: () => true,
          getCovid19Options: () => [],
          getCollectionNetworkOptions: () => [],
          getCovid19NetworkOptions: () => [],
          getBiobankNetworkOptions: () => [],
          getActiveFilters: () => [],
          bookmarkMappedToState: () => true,
          filterDefinitions
        }
      })
      wrapper = shallowMount(FilterContainer, { store, localVue })
      expect(wrapper.vm.filters.find((filter) => filter.name === 'country').name).toEqual('country')
    })

    it('should exclude the country filters if showCountryFacet is set to false', () => {
      store = new Vuex.Store({
        state: mockState(),
        actions: {
          GetCountryOptions: () => '',
          GetMaterialsOptions: () => '',
          GetCollectionQualityOptions: () => '',
          GetBiobankQualityOptions: () => '',
          GetTypesOptions: () => '',
          GetDataTypeOptions: () => '',
          GetCovid19Options: () => '',
          GetBiobankNetworkOptions: () => '',
          GetBiobankQualityBiobanks: () => ''
        },
        mutations: {},
        getters: {
          getMaterialOptions: () => [],
          getCountryOptions: () => [],
          getBiobankQualityOptions: () => [],
          getCollectionQualityOptions: () => [],
          getTypesOptions: () => [],
          getDataTypeOptions: () => [],
          showCountryFacet: () => false,
          getCovid19Options: () => [],
          getCollectionNetworkOptions: () => [],
          getCovid19NetworkOptions: () => [],
          getBiobankNetworkOptions: () => [],
          getActiveFilters: () => [],
          bookmarkMappedToState: () => true,
          filterDefinitions
        }
      })
      wrapper = shallowMount(FilterContainer, { store, localVue })
      expect(wrapper.vm.filters.find((filter) => filter.name === 'country')).toEqual(undefined)
    })
  })
})
