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

  beforeEach(() => {
    store = new Vuex.Store({
      state: { ...mockState(), filterFacets: filters },
      getters: {
        ...baseGetters,
        loading: () => false,
        foundCollectionIds: () => [],
        selectedCollections: () => [],
        activeFilters: () => ({})
      }
    })
  })

  it('should correctly divide the filterFacets in initial filters and more filters', () => {
    const wrapper = shallowMount(ApplicationHeader, { store, localVue, stubs: ['b-dropdown', 'b-button', 'font-awesome-icon', 'vue-slide-up-down'] })
    const facetCount = store.state.filterFacets.length
    const hiddenFacetCount = store.state.filterFacets.filter(facet => facet.hideFacet).length
    const builtinFacetCount = store.state.filterFacets.filter(facet => facet.builtIn).length

    expect(wrapper.vm.facetsToRender.length).toBe(facetCount - hiddenFacetCount - builtinFacetCount)
    expect(wrapper.vm.moreFacets.length).toBe(hiddenFacetCount)
  })
})
