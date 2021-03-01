import CollectionSelector from '../../../../../src/components/buttons/CollectionSelector'
import Vuex from 'vuex'
import { mount, createLocalVue } from '@vue/test-utils'
import { mockState } from '../../mockData'
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
    expect(AddCollectionToSelection).toHaveBeenCalledWith(expect.anything(), { collection: { label: 'Collection A', value: 'A' }, router: undefined })
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

    await wrapper.find('input[type=checkbox]').trigger('click')
    expect(RemoveCollectionFromSelection).toHaveBeenCalledWith(expect.anything(), { collection: { label: 'Collection A', value: 'A' }, router: undefined })
  })
})
