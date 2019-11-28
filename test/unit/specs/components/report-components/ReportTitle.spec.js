/* global describe it expect beforeEach */
import { shallowMount } from '@vue/test-utils'
import ReportTitle from '@/components/report-components/ReportTitle'

describe('ReportTitle', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(ReportTitle, {propsData: {name: 'beautiful collection', type: 'collection'}})
  })

  it('should initialize component with title', () => {
    expect(wrapper.html()).to.have.string('<div class="mg-report-title">')
  })

  it('should have correct type', () => {
    expect(wrapper.html()).to.have.string('"badge badge-secondary">collection')
  })

  it('should have correct title', () => {
    expect(wrapper.html()).to.have.string('<h1>beautiful collection')
  })
})
