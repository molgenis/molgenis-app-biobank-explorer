import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import BiobankExplorerContainer from '@/components/BiobankExplorerContainer'
import BootstrapVue from 'bootstrap-vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(Vuex)

/**
 * We're not doing unittests here, but focus on the shopping cart & podium modal because those
 * parts are the most complex.
 */
describe('BiobankExplorerContainer', () => {
  let store
  const biobanks = []
  const collectionsWithBiobank = [{ collectionId: 'A', biobankId: 'B', collectionName: 'Collection A' },
    { collectionId: 'C', biobankId: 'B', collectionName: 'Collection C' }, { collectionId: 'D', biobankId: 'E', collectionName: 'Collection D' }]
  const rsqlMock = jest.fn()
  const podiumCollectionsMock = jest.fn()

  beforeEach(() => {
    store = new Vuex.Store({
      state: {},
      getters: {
        rsql: rsqlMock,
        biobankRsql: () => '',
        getFoundBiobankIds: () => ['B'],
        getCollectionsWithBiobankId: () => collectionsWithBiobank,
        foundCollectionIds: () => collectionsWithBiobank.map(cb => cb.collectionsWithBiobank),
        foundBiobanks: () => biobanks,
        loading: () => false,
        collectionsInPodium: podiumCollectionsMock
      },
      actions: {
        GetBiobankIds: jest.fn(),
        GetPodiumCollections: jest.fn(),
        GetCollectionInfo: jest.fn()
      }
    })
  })

  it('should not render cart when no selection is made', () => {
    const wrapper = shallowMount(BiobankExplorerContainer, { store, localVue })
    expect(wrapper.html()).not.toContain('cart-selection-toast')
  })

  it('should render cart when one more more items are selected', () => {
    rsqlMock.mockReturnValueOnce('rsql-query')
    const wrapper = shallowMount(BiobankExplorerContainer, { store, localVue })
    expect(wrapper.html()).toContain('3 collection(s) selected')
  })

  it('should show modal when request button on cart is clicked when podium is true', () => {
    rsqlMock.mockReturnValueOnce('rsql-query')
    store.state.isPodium = true

    const wrapper = shallowMount(BiobankExplorerContainer, { store, localVue })
    wrapper.vm.sendToNegotiator()
    wrapper.vm.$nextTick()

    expect(wrapper.html()).toContain('podium-modal')
    expect(wrapper.html()).toContain('Sorry, none of the samples are currently in Podium.')
  })

  it('should render a list of names of collections which are in podium', () => {
    rsqlMock.mockReturnValueOnce('rsql-query')
    store.state.isPodium = true
    podiumCollectionsMock.mockReturnValueOnce(['Collection A', 'Collection D'])

    const wrapper = shallowMount(BiobankExplorerContainer, { store, localVue })

    wrapper.vm.sendToNegotiator()
    wrapper.vm.$nextTick()
    expect(wrapper.html()).toContain('Collection A')
    expect(wrapper.html()).toContain('Collection D')
  })
})
