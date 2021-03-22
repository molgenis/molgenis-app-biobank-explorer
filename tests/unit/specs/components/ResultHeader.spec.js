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
        foundCollectionIds: () => [],
        parentCollections: () => collectionsWithBiobank.map(cb => cb.collectionsWithBiobank),
        foundBiobanks: () => biobanks
      }
    })
  })

  it('should initialize component', () => {
    const wrapper = shallowMount(ResultHeader, { store, localVue })
    expect(wrapper.html()).toContain('<div class="search-box-container">')
  })
})
