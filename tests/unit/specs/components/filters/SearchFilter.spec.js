import { createLocalVue, shallowMount } from '@vue/test-utils'
import SearchFilter from '../../../../../src/components/filters/SearchFilter.vue'
import BootstrapVue from 'bootstrap-vue'
import Vuex from 'vuex'
import { baseGetters, mockState } from '../../mockData'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(Vuex)

describe('SearchFilter.vue', () => {
  let wrapper, activeFilters, UpdateFilterSelection
  const stubs = ['font-awesome-icon']

  beforeEach(() => {
    jest.useFakeTimers()

    activeFilters = jest.fn().mockReturnValue({ search: 'Searching...' })
    UpdateFilterSelection = jest.fn()
    const store = new Vuex.Store({
      state: mockState(),
      getters: {
        ...baseGetters,
        activeFilters
      },
      mutations: {
        UpdateFilterSelection
      }
    })

    wrapper = shallowMount(SearchFilter, {
      localVue,
      store,
      stubs
    })
  })

  it('can get the value of its active filter property', () => {
    expect(wrapper.vm.search).toBe('Searching...')
  })

  it('can set the value of its active filter property', () => {
    wrapper.vm.search = 'Searching...'

    jest.runAllTimers()
    expect(UpdateFilterSelection).toHaveBeenCalledWith(expect.anything(), { name: 'search', value: 'Searching...' })
  })
})
