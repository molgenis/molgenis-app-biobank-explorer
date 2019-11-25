import { shallowMount } from '@vue/test-utils'
import ReportDetailsTable from '@/components/report-components/ReportDetailsTable'

describe('ReportDetailsTable', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(ReportDetailsTable,
      {
        propsData:
          {
            tableContent: {
              stringValues: {name: 'henk', age: '20'},
              listValues: {hobbies: {values: ['chess', 'programming', 'nerdy stuff'], badgeColor: 'success'}}
            }
          }
      })
  })
  it('should initialize', () => {
    expect(wrapper.html()).to.have.string('class="mg-report-details-table">')
  })
  it('should contain name as string', () => {
    expect(wrapper.html()).to.have.string('henk</td>')
  })
  it('should contain age as string', () => {
    expect(wrapper.html()).to.have.string('20</td>')
  })
  it('should contain hobbies with correct color', () => {
    expect(wrapper.html()).to.have.string('class="badge m-1 badge-success">programming')
  })
})
