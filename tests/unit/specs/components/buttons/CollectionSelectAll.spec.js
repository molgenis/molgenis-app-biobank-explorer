import { mount, createLocalVue } from '@vue/test-utils'
import CollectionSelectAll from '@/components/buttons/CollectionSelectAll'
import Vuex from 'vuex'
import { baseGetters } from '../../mockData'

const localVue = createLocalVue()

localVue.use(Vuex)

describe('CollectionSelectAll', () => {
  let store, AddCollectionsToSelection, RemoveCollectionsFromSelection,
    allCollectionsSelected, foundCollectionsAsSelection

  const collectionMockData = [
    { value: 'Collection_1', label: 'First collection' },
    { value: 'Collection_2', label: 'Second collection' },
    { value: 'Collection_3', label: 'Third collection' }
  ]

  beforeEach(() => {
    AddCollectionsToSelection = jest.fn()
    RemoveCollectionsFromSelection = jest.fn()
    allCollectionsSelected = jest.fn()
    foundCollectionsAsSelection = jest.fn().mockReturnValue(collectionMockData)

    store = new Vuex.Store({
      state: {},
      getters: {
        ...baseGetters,
        allCollectionsSelected,
        foundCollectionsAsSelection
      },
      actions: {
        AddCollectionsToSelection
      },
      mutations: {
        RemoveCollectionsFromSelection
      }
    })
  })

  it('should call addCollectionsToSelection in the "select all" state', () => {
    const wrapper = mount(CollectionSelectAll, { store, localVue })
    const label = wrapper.find('label')

    // assert if correct state shown:
    expect(label.text().toLowerCase()).toContain('select all')
    label.trigger('click')

    expect(AddCollectionsToSelection).toHaveBeenCalledWith(expect.anything(), { bookmark: false, collections: collectionMockData })
  })

  it('should call RemoveCollectionsFromSelection in the "deselect all" state', () => {
    // you can't alter a method after the store has been initialized
    store = new Vuex.Store({
      getters: {
        ...baseGetters,
        allCollectionsSelected: jest.fn().mockReturnValue(true),
        foundCollectionsAsSelection
      },
      mutations: {
        RemoveCollectionsFromSelection
      }
    })

    const wrapper = mount(CollectionSelectAll, { store, localVue })
    const label = wrapper.findAll('label').at(1) // second label

    // assert if correct state shown:
    expect(label.text().toLowerCase()).toContain('deselect all')
    label.trigger('click')

    expect(RemoveCollectionsFromSelection).toHaveBeenCalledWith(expect.anything(), { bookmark: false, collections: collectionMockData })
  })

  it('should pass bookmark true when property is set to true', () => {
    const wrapper = mount(CollectionSelectAll, { store, propsData: { bookmark: true }, localVue })
    const label = wrapper.find('label')
    label.trigger('click')

    expect(AddCollectionsToSelection).toHaveBeenCalledWith(expect.anything(), { bookmark: true, collections: collectionMockData })
  })
})
