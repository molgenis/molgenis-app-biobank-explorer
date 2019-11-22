/* global describe it expect beforeEach */
import { shallowMount } from '@vue/test-utils'
import ReportDescription from '@/components/cards/ReportDescription'

describe('ReportDescription', () => {
  it('should initialize component with description', () => {
    const wrapper = shallowMount(ReportDescription, {propsData: {description: 'beautiful description'}})
    expect(wrapper.html()).to.have.string('<p class="mg-report-description">')
  })

  it('should not initialize component without description', () => {
    const wrapper = shallowMount(ReportDescription)
    expect(undefined).to.equal(wrapper.html())
  })

  describe('methods', () => {
    describe('showThisAttribute', () => {
      it('should toggle the ReportDescription boolean', () => {
        const wrapper = shallowMount(ReportDescription, {propsData: {description: 'beautiful description'}})
        expect(wrapper.vm.descriptionClosed).to.equal(true)
        wrapper.vm.toggleDescription()
        expect(wrapper.vm.descriptionClosed).to.equal(false)
      })
    })
  })
})
