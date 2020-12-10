import { shallowMount } from '@vue/test-utils'
import BiobankCard from '@/components/cards/BiobankCard'
import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

describe('BiobankCard', () => {
  let propsData, stubs, store

  beforeEach(() => {
    store = new Vuex.Store({
      state: {},
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
    stubs = ['router-link', 'router-view', 'b-img']
  })

  it('should initialize the collapsed prop to true if none is passed', () => {
    const wrapper = shallowMount(BiobankCard, { store, propsData, stubs })
    expect(wrapper.props().initCollapsed).toBe(true)
  })

  it('should use the passed collapsed setting if passed', () => {
    propsData.initCollapsed = false
    const wrapper = shallowMount(BiobankCard, { store, propsData, stubs })
    expect(wrapper.props().initCollapsed).toBe(false)
  })

  it('should expose a list of collectionTypes', () => {
    const wrapper = shallowMount(BiobankCard, { store, propsData, stubs })
    expect(wrapper.vm.collectionTypes).toBe('col-type-a, col-type-b, col-type-d, col-type-e')
  })
  it('should expose a list of covid19 types if available', () => {
    propsData.biobank.covid19biobank = [{ label: 'Member of the COVID-19 network' }, { name: 'COVID-19' }]
    const wrapper = shallowMount(BiobankCard, { store, propsData, stubs })
    expect(wrapper.vm.availableCovidTypes).toBe('Member of the COVID-19 network, COVID-19')
  })
  it('should return nothing if covid types are not available', () => {
    const wrapper = shallowMount(BiobankCard, { store, propsData, stubs })
    expect(wrapper.vm.availableCovidTypes).toBe('')
  })
  it('should sort collections based by name alphabeticaly', () => {
    const result = [{
      name: 'a',
      type: [{ label: 'col-type-d' }],
      sub_collections: [{
        type: [{ label: 'col-type-e' }],
        sub_collections: []
      }]
    },
    {
      name: 'z',
      type: [{ label: 'col-type-a' }],
      sub_collections: [{
        type: [{ label: 'col-type-b' }],
        sub_collections: []
      }]
    }]

    const wrapper = shallowMount(BiobankCard, { store, propsData, stubs })
    expect(wrapper.vm.sortedCollections).toStrictEqual(result)
  })
})
