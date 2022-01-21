import { createLocalVue, mount } from '@vue/test-utils'
import ActiveFilters from '../../../../../../src/components/filters/active/ActiveFilters.vue'
import filterDefinitions from '../../../../../../src/utils/filterDefinitions'
import { mockState } from '../../../mockData'

const localVue = createLocalVue()

describe('ActiveFilters.vue', () => {
  let wrapper

  const filters = filterDefinitions(mockState())

  beforeEach(() => {
    wrapper = mount(ActiveFilters, {
      localVue,
      stubs: ['font-awesome-icon'],
      propsData: {
        filters,
        value: {
          search: 'heriditary'
        }
      },
      listeners: {
        input: (newVal) => {
          wrapper.setProps({ value: newVal })
        }
      }
    })
  })

  it('will show default filter with its label and value ', () => {
    expect(wrapper.html().includes('Search: heriditary')).toBeTruthy()
  })
})
