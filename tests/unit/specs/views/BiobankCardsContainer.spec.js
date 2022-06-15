import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import BiobankCardsContainer from '@/components/BiobankCardsContainer'

const localVue = createLocalVue()

localVue.use(Vuex)

describe('BiobankCardsContainer', () => {
  let store
  const SetCurrentPage = jest.fn()
  const biobanks = []
  const activeFilters = { filter1: 'foobar' }

  beforeEach(() => {
    store = new Vuex.Store({
      state: { },
      getters: {
        biobanks: () => biobanks,
        loading: () => true,
        activeFilters: () => activeFilters,
        foundBiobanks: () => biobanks
      },
      mutations: {
        SetCurrentPage
      }
    })
  })

  it('should initialize component', () => {
    const wrapper = shallowMount(BiobankCardsContainer, { store, localVue })
    expect(wrapper.html()).toContain('<div class="status-text')
  })
})
