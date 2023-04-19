import { createLocalVue, mount } from '@vue/test-utils'
import MatchesOn from '../../../../../../src/components/generators/view-components/MatchesOn.vue'

import Vuex from 'vuex'
import { mockState } from '../../../mockData'

const localVue = createLocalVue()

localVue.use(Vuex)

let store

const viewmodel = {
  array_filter: [{ id: 1 }, { id: 2 }],
  bool_filter: true,
  single_value_filter: 'match',
  object_filter: { id: 3 }
}

const filterOptionDictionary = {
  randomName: [{ value: 1, text: 'One' }, { value: 2, text: 'Two' }],
  bool_filter: [{ value: true, text: 'It is true' }],
  single_value_filter: [{ value: 'match', text: 'It is a match' }],
  object_filter: [{ value: 3, text: 'Three!' }]
}

const filterFacets = [
  { name: 'randomName', columnName: 'array_filter', label: 'Array filter' },
  { name: 'bool_filter', columnName: 'bool_filter', label: 'A Boolean based filter' },
  { name: 'single_value_filter', columnName: 'single_value_filter', label: 'A single string value' },
  { name: 'object_filter', columnName: 'object_filter', label: 'Just an object laying around' }
]

describe('Matches On', () => {
  beforeEach(() => {
    store = new Vuex.Store({
      state: { ...mockState(), filterFacets, filterOptionDictionary }
    })
  })

  it('can generate a badge from an array and custom name', () => {
    store.getters = { activeFilters: { randomName: [1] } }
    const wrapper = mount(MatchesOn, { localVue, store, propsData: { viewmodel } })

    expect(wrapper.html()).toContain(filterOptionDictionary.randomName[0].text)
  })
  it('can generate a badge from a boolean', () => {
    store.getters = { activeFilters: { bool_filter: [true] } }
    const wrapper = mount(MatchesOn, { localVue, store, propsData: { viewmodel } })

    expect(wrapper.html()).toContain(filterOptionDictionary.bool_filter[0].text)
  })

  it('can generate a badge from a single value', () => {
    store.getters = { activeFilters: { single_value_filter: ['match'] } }
    const wrapper = mount(MatchesOn, { localVue, store, propsData: { viewmodel } })

    expect(wrapper.html()).toContain(filterOptionDictionary.single_value_filter[0].text)
  })
  it('can generate a badge from an object', () => {
    store.getters = { activeFilters: { object_filter: [3] } }
    const wrapper = mount(MatchesOn, { localVue, store, propsData: { viewmodel } })

    expect(wrapper.html()).toContain(filterOptionDictionary.object_filter[0].text)
  })
})
