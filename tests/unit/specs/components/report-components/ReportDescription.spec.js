import { shallowMount } from '@vue/test-utils'
import ReportDescription from '@/components/report-components/ReportDescription'

describe('ReportDescription', () => {
  it('should initialize component with description', () => {
    const wrapper = shallowMount(ReportDescription, { propsData: { description: 'beautiful description' } })
    expect(wrapper.html()).toContain('<p class="mg-report-description">')
  })

  it('should not initialize component without description', () => {
    const wrapper = shallowMount(ReportDescription)
    expect(wrapper.html()).toEqual('')
  })

  describe('methods', () => {
    describe('showThisAttribute', () => {
      it('should toggle the ReportDescription boolean', () => {
        const wrapper = shallowMount(ReportDescription, {
          propsData: {
            description: 'beautiful description',
            maxLength: 12
          }
        })
        expect(wrapper.vm.descriptionClosed).toEqual(true)
        wrapper.vm.toggleDescription()
        expect(wrapper.vm.descriptionClosed).toEqual(false)
      })
    })
  })

  describe('computed', () => {
    describe('descriptionToDisplay', () => {
      it('should not cut off words when closed', () => {
        const wrapper = shallowMount(ReportDescription, {
          propsData: {
            description: 'beautiful description',
            maxLength: 12
          }
        })
        expect(wrapper.vm.descriptionToDisplay).toEqual('beautiful')
      })

      it('should display complete description when max length is equal to length of description', () => {
        const wrapper = shallowMount(ReportDescription, {
          propsData: {
            description: 'beautiful description',
            maxLength: 21
          }
        })
        expect(wrapper.vm.descriptionToDisplay).toEqual('beautiful description')
      })
    })
  })
})
