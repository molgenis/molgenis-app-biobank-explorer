import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import NegotiatorSelection from '@/components/popovers/NegotiatorSelection.vue'
import BootstrapVue from 'bootstrap-vue'
import { mockState, baseGetters } from '../../mockData'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(Vuex)

describe('Negotiator Selection Modal', () => {
  let store

  const podiumCollectionsMock = jest.fn().mockReturnValue([])
  const selectedCollectionMock = jest.fn().mockReturnValue([])

  beforeEach(() => {
    store = new Vuex.Store({
      state: mockState(),
      getters: {
        ...baseGetters,
        selectedCollections: selectedCollectionMock,
        collectionsInPodium: podiumCollectionsMock,
        collectionBiobankDictionary: () => []
      },
      actions: {
        SendToNegotiator: jest.fn()
      }
    })
  })

  describe('Podium logic', () => {
    it('should show "no podium collections" message when there are no podium collections and isPodium is true', () => {
      selectedCollectionMock.mockReturnValueOnce(['a', 'b', 'c'])
      store.state.isPodium = true

      const wrapper = shallowMount(NegotiatorSelection, { store, localVue, propsData: { value: true } })
      expect(wrapper.html()).toContain('Sorry, none of the samples are currently in Podium.')
    })

    it('should render a list of names of collections which are in podium', () => {
      store.state.isPodium = true
      podiumCollectionsMock.mockReturnValueOnce([{ label: 'Collection A', value: 'A' }, { label: 'Collection D', value: 'D' }])

      const wrapper = shallowMount(NegotiatorSelection, { store, localVue, propsData: { value: true } })

      wrapper.vm.sendRequest()
      wrapper.vm.$nextTick()
      expect(wrapper.html()).toContain('Collection A')
      expect(wrapper.html()).toContain('Collection D')
    })

    it('should render podium specific modal footer when podium is active', () => {
      store.state.isPodium = true
      const wrapper = shallowMount(NegotiatorSelection, { store, localVue, propsData: { value: true } })
      expect(wrapper.vm.modalFooterText).toEqual('0 collection(s) present in Podium')
    })

    it('should set Send to Podium text when podium is active', () => {
      store.state.isPodium = true
      const wrapper = shallowMount(NegotiatorSelection, { store, localVue, propsData: { value: true } })
      expect(wrapper.vm.negotiatorButtonText).toEqual('Send to Podium')
    })

    it('should set Send to the Negotiator text when podium is not active', () => {
      store.state.isPodium = false
      const wrapper = shallowMount(NegotiatorSelection, { store, localVue, propsData: { value: true } })
      expect(wrapper.vm.negotiatorButtonText).toEqual('Send to the Negotiator')
    })
  })
})
