import { createLocalVue, mount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import FilterCard from '@/components/filters/containers/FilterCard.vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
const stubs = ['font-awesome-icon']

const name = 'name'

describe('FilterCard.vue', () => {
  describe('starts closed', () => {
    const wrapper = mount(FilterCard, { localVue, stubs, propsData: { name } })
    it('can open and close', async () => {
      expect(wrapper.find('div#name').element.style.display).toEqual('none') // Closed
      await wrapper.find('.card-header').trigger('click')
      expect(wrapper.find('div#name').element.style.display).toEqual('') // Open
      await wrapper.find('.card-header').trigger('click')
      expect(wrapper.find('div#name').element.style.display).toEqual('none') // Closed again
    })
  })

  describe('starts open', () => {
    const wrapper = mount(FilterCard, { localVue, stubs, propsData: { name, collapsed: false } })
    it('can open and close (starts open)', async () => {
      expect(wrapper.find('div#name').element.style.display).toEqual('') // Open
      await wrapper.find('.card-header').trigger('click')
      expect(wrapper.find('div#name').element.style.display).toEqual('none') // Closed
      await wrapper.find('.card-header').trigger('click')
      expect(wrapper.find('div#name').element.style.display).toEqual('') // Open again
    })
  })

  describe('setting collapsable to false', () => {
    const wrapper = mount(FilterCard, { localVue, stubs, propsData: { name, collapsable: false, collapsed: true } })
    it('will force the card to be open all the time', async () => {
      expect(wrapper.find('div#name').element.style.display).toEqual('') // Open
      await wrapper.find('.card-header').trigger('click')
      expect(wrapper.find('div#name').element.style.display).toEqual('') // Still open, no collapsable
    })
  })

  it('emits an event if the close button is clicked', async () => {
    const close = mount(FilterCard, {
      localVue,
      stubs,
      propsData: {
        name,
        collapsable: false,
        collapsed: true,
        canRemove: true
      }
    })
    expect(close.emitted().removeFilter).toBeUndefined()
    await close.find('.remove-button').trigger('click')

    expect(close.emitted().removeFilter[0]).toEqual(['name'])
  })
})
