import { shallowMount } from '@vue/test-utils'
import ReportListRow from '@/components/report-components/ReportListRow'

describe('ReportListRow', () => {
  it('should return false if it is an array', () => {
    const wrapper = shallowMount(ReportListRow, { propsData: { data: { value: ['diagnosis A', 'Diagnosis B'] } } })
    expect(wrapper.vm.dataContainsUri).toBe(false)
  })
})
