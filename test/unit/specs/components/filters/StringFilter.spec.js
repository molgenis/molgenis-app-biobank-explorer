/* global describe it expect */
import StringFilter from '@/components/filters/StringFilter'
import { mount } from '@vue/test-utils'

describe('Stringfilter', () => {
  let wrapper
  beforeEach(() => {
    // Do a full mount so we can click the actual inputs
    wrapper = mount(StringFilter, {
      propsData: {
        name: 'search',
        label: 'Search',
        value: '',
        initiallyCollapsed: false
      }
    })
  })
  it('should respond to a value change', () => {
    wrapper.setProps({value: 'hello world'})
    expect(wrapper.vm.$data.model).to.eq('hello world')
  })
})
