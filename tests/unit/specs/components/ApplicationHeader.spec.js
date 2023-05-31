import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import ApplicationHeader from '@/components/ApplicationHeader'
import { baseGetters, mockState } from '../mockData'
import { createFilters } from '../../../../src/config/facetConfigurator'
import filterDefinitions from '../../../../src/config/initialFilterFacets'

const localVue = createLocalVue()

localVue.use(Vuex)

describe('ApplicationHeader', () => {
  let store

  const filters = createFilters({ filterFacets: filterDefinitions, filters: { selections: {}, satisfyAll: [] } })
  /** for testing purposes, hide a filter */
  filters[5].showFacet = false
  const setFilterActivation = jest.fn()
  const getReducedFilterOptions = jest.fn()
  beforeEach(() => {
    store = new Vuex.Store({
      state: { ...mockState(), filterFacets: filters },
      getters: {
        ...baseGetters,
        loading: () => false,
        foundCollectionIds: () => [],
        selectedCollections: () => [],
        activeFilters: () => ({}),
        activeSatisfyAll: () => []
      },
      actions: {
        setFilterActivation,
        getReducedFilterOptions
      }
    })
  })

  it('should correctly divide the filterFacets in initial filters and more filters', () => {
    const wrapper = shallowMount(ApplicationHeader, { store, localVue, stubs: ['b-dropdown', 'b-button', 'font-awesome-icon', 'vue-slide-up-down'] })
    const facetCount = store.state.filterFacets.length
    const shownFacetCount = store.state.filterFacets.filter(facet => facet.showFacet).length
    const builtinFacetCount = store.state.filterFacets.filter(facet => facet.builtIn).length

    expect(wrapper.vm.facetsToRender.length).toBe(shownFacetCount)
    expect(wrapper.vm.moreFacets.length).toBe(facetCount - shownFacetCount - builtinFacetCount)
  })

  it('calculates reduced filteroptions if the filter is adaptive', () => {
    const wrapper = shallowMount(ApplicationHeader, { store, localVue, stubs: ['b-dropdown', 'b-button', 'font-awesome-icon', 'vue-slide-up-down'] })
    const adaptiveFacet = store.state.filterFacets.filter(facet => facet.adaptive)[0]
    wrapper.vm.calculateOptions(adaptiveFacet)
    expect(setFilterActivation).toBeCalledWith(expect.anything(), { filterName: 'country', activation: true })
  })

  it('sets the corresponding filter inactive if the dropdown menu is hidden', () => {
    const wrapper = shallowMount(ApplicationHeader, { store, localVue, stubs: ['b-dropdown', 'b-button', 'font-awesome-icon', 'vue-slide-up-down'] })
    const adaptiveFacet = store.state.filterFacets.filter(facet => facet.adaptive)[0]
    wrapper.vm.setInactive(adaptiveFacet)
    expect(setFilterActivation).toBeCalledWith(expect.anything(), { filterName: 'country', activation: false })
  })
})
