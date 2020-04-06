/* global describe it expect beforeEach */
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import BiobankCardsContainer from '@/components/cards/BiobankCardsContainer'

const localVue = createLocalVue()

localVue.use(Vuex)

describe('BiobankCardsContainer', () => {
  let store
  let biobanks = []
  let activeFilters = {filter1: 'foobar'}

  beforeEach(() => {
    store = new Vuex.Store({
      state: {},
      getters: {
        biobanks: () => biobanks,
        loading: () => true,
        getActiveFilters: () => activeFilters
      }
    })
  })

  it('should initialize component', () => {
    const wrapper = shallowMount(BiobankCardsContainer, {store})
    expect(wrapper.html()).to.have.string('<div class="biobank-cards-container">')
  })

  it('should return "true" for isAnyFilterActive if filters are active', () => {
    const wrapper = shallowMount(BiobankCardsContainer, {store})
    expect(wrapper.vm.isAnyFilterActive).to.equal(true)
  })

  it('should return "false" for isAnyFilterActive if no filters are active', () => {
    activeFilters = {}
    const wrapper = shallowMount(BiobankCardsContainer, {store})
    expect(wrapper.vm.isAnyFilterActive).to.equal(false)
  })

  it('should reset the currentPage to 1 if when the biobanks list changes', () => {
    activeFilters = {}
    const wrapper = shallowMount(BiobankCardsContainer, {
      store,
      computed: {
        biobanks () {
          return biobanks
        }
      }
    })
    wrapper.setData({currentPage: 5})
    expect(wrapper.vm.currentPage).to.equal(5)
    // see https://github.com/vuejs/vue-test-utils/issues/331 for details
    wrapper.vm.$options.watch.biobankIds.call(wrapper.vm, ['id1'], ['id2'])
    expect(wrapper.vm.currentPage).to.equal(1)
  })
})
