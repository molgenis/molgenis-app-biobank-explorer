import { mount, createLocalVue } from '@vue/test-utils'
import CollectionSelectAll from '@/components/buttons/CollectionSelectAll'
import Vuex from 'vuex'
import VueRouter from 'vue-router'

const localVue = createLocalVue()
const router = new VueRouter()

localVue.use(Vuex)
localVue.use(VueRouter)

describe('CollectionSelectAll', () => {
  let store, AddCollectionToSelection, RemoveCollectionFromSelection,
    allCollectionsSelected, foundCollectionsAsSelection

  const collectionMockData = [
    { value: 'Collection_1', label: 'First collection' },
    { value: 'Collection_2', label: 'Second collection' },
    { value: 'Collection_3', label: 'Third collection' }
  ]

  beforeEach(() => {
    AddCollectionToSelection = jest.fn()
    RemoveCollectionFromSelection = jest.fn()
    allCollectionsSelected = jest.fn()
    foundCollectionsAsSelection = jest.fn().mockReturnValue(collectionMockData)

    store = new Vuex.Store({
      state: {},
      getters: {
        allCollectionsSelected,
        foundCollectionsAsSelection
      },
      mutations: {
        AddCollectionToSelection,
        RemoveCollectionFromSelection
      }
    })
  })

  it('should call addCollectionToSelection in the "select all" state', () => {
    const wrapper = mount(CollectionSelectAll, { store, localVue })
    const label = wrapper.find('label')

    // assert if correct state shown:
    expect(label.text().toLowerCase()).toContain('select all')
    label.trigger('click')

    expect(AddCollectionToSelection).toHaveBeenCalledWith(expect.anything(), { collection: collectionMockData })
  })

  it('should call RemoveCollectionFromSelection in the "deselect all" state', () => {
    // you can't alter a method after the store has been initialized
    store = new Vuex.Store({
      getters: {
        allCollectionsSelected: jest.fn().mockReturnValue(true),
        foundCollectionsAsSelection
      },
      mutations: {
        RemoveCollectionFromSelection
      }
    })

    const wrapper = mount(CollectionSelectAll, { store, localVue })
    const label = wrapper.findAll('label').at(1) // second label

    // assert if correct state shown:
    expect(label.text().toLowerCase()).toContain('deselect all')
    label.trigger('click')

    expect(RemoveCollectionFromSelection).toHaveBeenCalledWith(expect.anything(), { collection: collectionMockData })
  })

  it('should call addCollectionToSelection with router if routerEnabled is true', () => {
    const wrapper = mount(CollectionSelectAll, { store, propsData: { routerEnabled: true }, localVue, router })
    const label = wrapper.find('label')
    label.trigger('click')

    expect(AddCollectionToSelection).toHaveBeenCalledWith(expect.anything(), { collection: collectionMockData, router })
  })
})
