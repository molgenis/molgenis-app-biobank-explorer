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

  it('should initialize component', () => {
    const wrapper = shallowMount(ApplicationHeader, { store, localVue, stubs: ['b-dropdown', 'b-button', 'font-awesome-icon', 'vue-slide-up-down'] })
    expect(wrapper.html()).toContain('header-bar')
  })
})
