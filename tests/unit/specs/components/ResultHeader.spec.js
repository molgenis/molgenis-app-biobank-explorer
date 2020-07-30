import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import ResultHeader from '@/components/ResultHeader'

const localVue = createLocalVue()

localVue.use(Vuex)

describe('BiobankCardsContainer', () => {
  let store
  const biobanks = []
  const collectionsWithBiobank = [{ collectionId: 'A', biobankId: 'B' }, { collectionId: 'C', biobankId: 'B' }, { collectionId: 'D', biobankId: 'E' }]

  beforeEach(() => {
    store = new Vuex.Store({
      state: {},
      getters: {
        rsql: () => '',
        getFoundBiobankIds: () => ['B'],
        getCollectionsWithBiobankId: () => collectionsWithBiobank,
        foundBiobanks: () => biobanks
      }
    })
  })

  it('should initialize component', () => {
    const wrapper = shallowMount(ResultHeader, { store, localVue })
    expect(wrapper.html()).toContain('<div class="search-box-container">')
  })

  it('should return the total amount of collections for found biobanks', () => {
    const wrapper = shallowMount(ResultHeader, { store, localVue })
    expect(wrapper.vm.foundCollections).toEqual(collectionsWithBiobank.filter(b => b.biobankId === 'B').map(cb => cb.collectionId).length)
  })
  it('should return the total amount of found collections biobank ids are empty', () => {
    store = new Vuex.Store({
      state: {},
      getters: {
        rsql: () => '',
        getFoundBiobankIds: () => [],
        getCollectionsWithBiobankId: () => collectionsWithBiobank,
        foundBiobanks: () => biobanks
      }
    })
    const wrapper = shallowMount(ResultHeader, { store, localVue })
    expect(wrapper.vm.foundCollections).toEqual(collectionsWithBiobank.length)
  })
})
