import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import BiobankExplorerContainer from '@/components/BiobankExplorerContainer'
import BootstrapVue from 'bootstrap-vue'
import { mockState } from '../mockData'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(Vuex)

/**
 * We're not doing unittests here, but focus on the shopping cart & podium modal because those
 * parts are the most complex.
 */
describe('BiobankExplorerContainer', () => {
  let store
  const collectionsWithBiobank = [{ collectionId: 'A', biobankId: 'B', collectionName: 'Collection A' },
    { collectionId: 'C', biobankId: 'B', collectionName: 'Collection C' }, { collectionId: 'D', biobankId: 'E', collectionName: 'Collection D' }]

  const rsqlMock = jest.fn().mockReturnValue('')
  const podiumCollectionsMock = jest.fn().mockReturnValue([])
  const selectedCollectionMock = jest.fn().mockReturnValue([])
  const foundCollectionsAsSelectionMock = jest.fn()
  const AddCollectionToSelectionMock = jest.fn()
  const allCollectionsSelectedMock = jest.fn()
  const MapQueryToStateMock = jest.fn()

  beforeEach(() => {
    store = new Vuex.Store({
      state: mockState(),
      getters: {
        rsql: rsqlMock,
        activeFilters: () => {},
        biobankRsql: () => '',
        selectedBiobankQuality: () => [],
        selectedCollectionQuality: () => [],
        selectedCollections: selectedCollectionMock,
        foundCollectionIds: () => collectionsWithBiobank.map(cb => cb.collectionsWithBiobank),
        loading: () => false,
        allCollectionsSelected: allCollectionsSelectedMock,
        collectionsInPodium: podiumCollectionsMock,
        foundCollectionsAsSelection: foundCollectionsAsSelectionMock,
        collectionBiobankDictionary: () => [],
        ie11Bookmark: jest.fn().mockReturnValue('http://mytest.org/#/?materials=CDNA&cart=YmJtcmktZXJpYzpJRDpUUl9BQ1U6Y29sbGVjdGlvbjpjb3ZpZDE5')
      },
      mutations: {
        AddCollectionToSelection: AddCollectionToSelectionMock,
        MapQueryToState: MapQueryToStateMock
      },
      actions: {
        SendToNegotiator: jest.fn(),
        GetBiobankIds: jest.fn(),
        GetPodiumCollections: jest.fn(),
        GetCollectionInfo: jest.fn(),
        GetBiobankIdsForQuality: jest.fn(),
        GetCollectionIdsForQuality: jest.fn()
      }
    })
  })

  it('should not render cart when no selection is made', () => {
    const wrapper = shallowMount(BiobankExplorerContainer, { store, localVue })
    expect(wrapper.html()).not.toContain('cart-selection-toast')
  })

  it('should render cart when one more more items are selected', async () => {
    selectedCollectionMock.mockReturnValueOnce(['a', 'b', 'c'])
    const wrapper = shallowMount(BiobankExplorerContainer, { store, localVue })
    expect(wrapper.html()).toContain('3 collection(s) selected')
  })

  describe('Podium logic', () => {
    it('should show "no podium collections" message when there are no podium collections and isPodium is true', () => {
      selectedCollectionMock.mockReturnValueOnce(['a', 'b', 'c'])
      store.state.isPodium = true

      const wrapper = shallowMount(BiobankExplorerContainer, { store, localVue })

      wrapper.vm.showSelection()
      wrapper.vm.$nextTick()

      expect(wrapper.html()).toContain('Sorry, none of the samples are currently in Podium.')
    })

    it('should render a list of names of collections which are in podium', () => {
      rsqlMock.mockReturnValueOnce('rsql-query')
      store.state.isPodium = true
      podiumCollectionsMock.mockReturnValueOnce([{ label: 'Collection A', value: 'A' }, { label: 'Collection D', value: 'D' }])

      const wrapper = shallowMount(BiobankExplorerContainer, { store, localVue })

      wrapper.vm.sendRequest()
      wrapper.vm.$nextTick()
      expect(wrapper.html()).toContain('Collection A')
      expect(wrapper.html()).toContain('Collection D')
    })

    it('should render podium specific modal footer when podium is active', () => {
      store.state.isPodium = true
      const wrapper = shallowMount(BiobankExplorerContainer, { store, localVue })
      expect(wrapper.vm.modalFooterText).toEqual('0 collection(s) present in Podium')
    })
  })

  describe('IE11 Bookmark logic', () => {
    it('Should map a IE11 bookmark to the state', () => {
      const wrapper = shallowMount(BiobankExplorerContainer, { store, localVue })
      wrapper.setData({ ie11BookmarkToApply: 'http://mytest.org/#/?materials=CDNA&cart=YmJtcmktZXJpYzpJRDpUUl9BQ1U6Y29sbGVjdGlvbjpjb3ZpZDE5' })
      wrapper.vm.applyIE11Bookmark()
      expect(MapQueryToStateMock).toHaveBeenCalledWith(expect.anything(), { cart: 'YmJtcmktZXJpYzpJRDpUUl9BQ1U6Y29sbGVjdGlvbjpjb3ZpZDE5', materials: 'CDNA' })
    })
  })
})
