import { createLocalVue, shallowMount } from '@vue/test-utils'
import BiobankCard from '@/components/cards/BiobankCard'
import { mockState } from '../../mockData'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('BiobankCard', () => {
  let propsData, stubs, store

  beforeEach(() => {
    store = new Vuex.Store({
      state: mockState(),
      getters: {
        selectedCollections: () => []
      }
    })

    propsData = {
      biobank: {
        id: 'biobank-1',
        collections: [{
          name: 'z',
          type: [{ label: 'col-type-a' }],
          sub_collections: [{
            type: [{ label: 'col-type-b' }],
            sub_collections: []
          }]
        },
        {
          name: 'a',
          type: [{ label: 'col-type-d' }],
          sub_collections: [{
            type: [{ label: 'col-type-e' }],
            sub_collections: []
          }]
        }]
      }
    }
    stubs = ['router-link', 'router-view', 'b-img', 'font-awesome-icon']
  })

  it('needs new tests', () => {
    const wrapper = shallowMount(BiobankCard, { localVue, store, propsData, stubs })
    expect(wrapper).not.toBe(undefined)
  })
})
