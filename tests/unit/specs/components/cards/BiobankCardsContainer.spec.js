import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import BiobankCardsContainer from '@/components/cards/BiobankCardsContainer'

const localVue = createLocalVue()

localVue.use(Vuex)

describe('BiobankCardsContainer', () => {
  let store
  const biobanks = []
  let activeFilters = { filter1: 'foobar' }

  beforeEach(() => {
    store = new Vuex.Store({
      state: {},
      getters: {
        biobanks: () => biobanks,
        loading: () => true,
        activeFilters: () => activeFilters,
        foundBiobanks: () => biobanks
      }
    })
  })

  it('should initialize component', () => {
    const wrapper = shallowMount(BiobankCardsContainer, { store, localVue })
    expect(wrapper.html()).toContain('<div class="biobank-cards-container">')
  })

  it('should reset the currentPage to 1 if when the biobanks list changes', () => {
    activeFilters = {}
    const wrapper = shallowMount(BiobankCardsContainer, {
      store,
      computed: {
        biobanks () {
          return biobanks
        }
      },
      localVue
    })
    wrapper.setData({ currentPage: 5 })
    expect(wrapper.vm.currentPage).toEqual(5)
    // see https://github.com/vuejs/vue-test-utils/issues/331 for details
    wrapper.vm.$options.watch.biobankIds.call(wrapper.vm, ['id1'], ['id2'])
    expect(wrapper.vm.currentPage).toEqual(1)
  })
})
