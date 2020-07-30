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
  it('should respond to a value change', async (done) => {
    wrapper.setProps({ value: 'hello world' })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.$data.model).toEqual('hello world')
    done()
  })
  it('should reset model to empty string when user resets', () => {
    wrapper.setData({ model: 'hello world' })
    wrapper.find('button').trigger('click')
    expect(wrapper.vm.$data.model).toEqual('')
  })
})
