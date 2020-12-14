import FilterContainer from '@/components/filters/FilterContainer'
import Vuex from 'vuex'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import { mockState } from '../../mockData'
import filterDefinitions from '../../../../../src/utils/filterDefinitions'
const localVue = createLocalVue()
localVue.use(Vuex)
jest.useFakeTimers()

describe('FilterContainer', () => {
  let store, wrapper, actions, getters, mutations

  beforeEach(() => {
    actions = {
      GetBiobankQualityBiobanks: () => ''
    }

    getters = {
      showCountryFacet: () => true,
      activeFilters: () => [],
      bookmarkMappedToState: () => true,
      filterDefinitions
    }

    mutations = {
      UpdateFilter: jest.fn()
    }
  })

  describe('filters', () => {
    it('should include the country filters if showCountryFacet is set to true', () => {
      store = new Vuex.Store({
        state: mockState(),
        actions,
        mutations,
        getters
      })
      wrapper = shallowMount(FilterContainer, { store, localVue })
      expect(wrapper.vm.filters.find((filter) => filter.name === 'country').name).toEqual('country')
    })

    it('should exclude the country filters if showCountryFacet is set to false', () => {
      getters.showCountryFacet = () => false
      store = new Vuex.Store({
        state: mockState(),
        actions,
        mutations,
        getters
      })
      wrapper = shallowMount(FilterContainer, { store, localVue })
      expect(wrapper.vm.filters.find((filter) => filter.name === 'country')).toEqual(undefined)
    })

    it('should ony trigger the update filter once, if there are multiple search inputs consecutivly', () => {
      store = new Vuex.Store({
        state: mockState(),
        actions,
        mutations,
        getters
      })

      wrapper = shallowMount(FilterContainer, { store, localVue })
      wrapper.setData({ search: 'collectio' })
      wrapper.setData({ search: 'collection1' })

      jest.runAllTimers()
      expect(mutations.UpdateFilter).toHaveBeenCalledTimes(1)
    })
  })
})
