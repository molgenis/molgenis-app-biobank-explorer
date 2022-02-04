import { shallowMount, createLocalVue } from '@vue/test-utils'
import InfoPopover from '@/components/popovers/InfoPopover.vue'
import BootstrapVue from 'bootstrap-vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

describe('Info Popover', () => {
  it('should create a unique id per popover', () => {
    const wrapper1 = shallowMount(InfoPopover, { localVue })
    const id1 = wrapper1.vm.$data.uniqueId

    const wrapper2 = shallowMount(InfoPopover, { localVue })
    const id2 = wrapper2.vm.$data.uniqueId

    expect(id1).not.toEqual(id2)
  })
})
