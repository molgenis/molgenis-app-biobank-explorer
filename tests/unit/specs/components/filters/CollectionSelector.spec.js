import CollectionSelector from '../../../../../src/components/filters/CollectionSelector'
import Vuex from 'vuex'
import { mount, createLocalVue } from '@vue/test-utils'
import { mockState } from '../../mockState'
const localVue = createLocalVue()
localVue.use(Vuex)

const AddCollectionToSelection = jest.fn()
const RemoveCollectionFromSelection = jest.fn()
const selectedCollections = jest.fn().mockReturnValue([])

describe('CollectionSelector.vue', () => {
  const store = new Vuex.Store({
    state: mockState(),
    mutations: {
      AddCollectionToSelection,
      RemoveCollectionFromSelection
    },
    getters: {
      selectedCollections
    }
  })
  it('can set a value on the state when clicked', async () => {
    const wrapper = mount(CollectionSelector, { store, localVue, propsData: { collection: { name: 'Collection A', id: 'A' } } })

    await wrapper.find('input[type=checkbox]').trigger('click')
    expect(AddCollectionToSelection).toHaveBeenCalledTimes(1)
    expect(AddCollectionToSelection).toHaveBeenCalledWith(expect.anything(), { label: 'Collection A', value: 'A' })
  })

  it('can remove a value on the state when clicked', async () => {
    selectedCollections.mockReturnValueOnce([{ value: 'A' }])
    const store = new Vuex.Store({
      state: mockState(),
      mutations: {
        AddCollectionToSelection,
        RemoveCollectionFromSelection
      },
      getters: {
        selectedCollections
      }
    })
    const wrapper = mount(CollectionSelector, { store, localVue, propsData: { collection: { name: 'Collection A', id: 'A' } } })
    console.log(wrapper.vm.collectionSelected('A'))
    await wrapper.find('input[type=checkbox]').trigger('click')
    expect(RemoveCollectionFromSelection).toHaveBeenCalledTimes(1)
    expect(RemoveCollectionFromSelection).toHaveBeenCalledWith(expect.anything(), { label: 'Collection A', value: 'A' })
  })
})
