import { mount, createLocalVue } from '@vue/test-utils'
import CollectionSelector from '@/components/buttons/CollectionSelector'
import Vuex from 'vuex'
import { baseGetters } from '../../mockData'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('CollectionSelector', () => {
  let store, AddCollectionsToSelection, RemoveCollectionsFromSelection,
    selectedCollections

  const collectionData = [
    { id: 'Collection_1', label: 'First collection' },
    { id: 'Collection_2', label: 'Second collection' },
    { id: 'Collection_3', label: 'Third collection' }

  ]

  const collectionResolveData = [
    { value: 'Collection_1', label: 'First collection' },
    { value: 'Collection_2', label: 'Second collection' },
    { value: 'Collection_3', label: 'Third collection' }
  ]

  beforeEach(() => {
    AddCollectionsToSelection = jest.fn()
    RemoveCollectionsFromSelection = jest.fn()
    selectedCollections = jest.fn().mockReturnValue([])

    store = new Vuex.Store({
      state: {},
      getters: {
        ...baseGetters,
        selectedCollections
      },
      actions: {
        AddCollectionsToSelection
      },
      mutations: {
        RemoveCollectionsFromSelection
      }
    })
  })

  it('should call addCollectionsToSelection in the default state', () => {
    const propsData = { collectionData }

    const wrapper = mount(CollectionSelector, { store, propsData, localVue })
    const label = wrapper.find('label')

    // assert if correct state shown:
    expect(label.text().toLowerCase()).toContain('add')
    label.trigger('click')

    expect(AddCollectionsToSelection).toHaveBeenCalledWith(expect.anything(), { bookmark: false, collections: collectionResolveData })
  })

  it('should call RemoveCollectionsFromSelection in the "deselect all" state', () => {
    const propsData = { collectionData }

    // you can't alter a method after the store has been initialized
    store = new Vuex.Store({
      getters: {
        ...baseGetters,
        selectedCollections: jest.fn().mockReturnValue(collectionResolveData)
      },
      mutations: {
        RemoveCollectionsFromSelection
      }
    })

    const wrapper = mount(CollectionSelector, { store, propsData, localVue })
    const label = wrapper.findAll('label').at(1) // second label

    // assert if correct state shown:
    expect(label.text().toLowerCase()).toContain('remove')
    label.trigger('click')

    expect(RemoveCollectionsFromSelection).toHaveBeenCalledWith(expect.anything(), { bookmark: false, collections: collectionResolveData })
  })

  it('should call addCollectionsToSelection with bookmark true if bookmark is true', () => {
    const propsData = { collectionData, bookmark: true }

    const wrapper = mount(CollectionSelector, { store, propsData, localVue })
    const label = wrapper.find('label')
    label.trigger('click')

    expect(AddCollectionsToSelection).toHaveBeenCalledWith(expect.anything(), { bookmark: true, collections: collectionResolveData })
  })

  it('should convert a single collection to an array', () => {
    const propsData = { collectionData: { id: 'single_collection', label: 'Single Collection' } }

    const wrapper = mount(CollectionSelector, { store, propsData, localVue })
    const label = wrapper.find('label')
    label.trigger('click')

    expect(wrapper.vm.$data.collections).toEqual([{ value: 'single_collection', label: 'Single Collection' }])
  })
})
