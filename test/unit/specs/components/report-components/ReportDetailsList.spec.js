/* global describe it expect beforeEach */
import { shallowMount } from '@vue/test-utils'
import ReportDetailsList from '@/components/report-components/ReportDetailsList'

describe('ReportDetailsList', () => {
  let wrapper
  beforeEach(() => {
    const stubs = ['router-link']
    wrapper = shallowMount(ReportDetailsList,
      {
        stubs,
        propsData:
          {
            reportDetails: {
              name: {
                value: 'Some Name',
                type: 'string'
              },
              website: {
                value: 'http://myWebsite.com',
                type: 'url'
              },
              email: {
                value: 'myEmail@myWebsite.com',
                type: 'email'
              },
              phone: {
                value: '+1234567890',
                type: 'phone'
              },
              bool_true: {
                value: true,
                type: 'bool'
              },
              bool_false: {
                value: false,
                type: 'bool'
              },
              list: {
                value: ['val1', 'val2'],
                type: 'list'
              },
              list_color: {
                value: ['val3'],
                type: 'list',
                badgeColor: 'primary'
              },
              report: {
                value: '/biobank/somebiobank',
                type: 'report'
              },
              string_with_key: {
                value: 'string',
                type: 'string-with-key'
              }
            }
          }
      })
  })
  it('should initialize', () => {
    expect(wrapper.html()).to.have.string('class="mg-report-details-list mb-3">')
  })
  it('should contain name as string', () => {
    expect(wrapper.html()).to.have.string('Some Name')
  })
  it('should contain email as email', () => {
    expect(wrapper.html()).to.have.string('href="mailto:myEmail@myWebsite.com">')
  })
  it('should contain website as url', () => {
    expect(wrapper.html()).to.have.string('href="http://myWebsite.com" target="_blank" rel="noopener noreferrer">')
  })
  it('should contain phone number as phone type', () => {
    expect(wrapper.html()).to.have.string('class="mg-icon-text">+1234567890')
  })
  it('should contain bool true value', () => {
    expect(wrapper.html()).to.have.string('class="badge badge-success">yes')
  })
  it('should contain bool false value', () => {
    expect(wrapper.html()).to.have.string('class="badge badge-danger">no')
  })
  it('should contain list with default color', () => {
    expect(wrapper.html()).to.have.string('class="m-1 badge badge-success">val1')
  })
  it('should contain list with other color', () => {
    expect(wrapper.html()).to.have.string('class="m-1 badge badge-primary">val3')
  })
  it('should contain report', () => {
    expect(wrapper.html()).to.have.string('to="/biobank/somebiobank"><i')
  })
  it('should contain string with key', () => {
    expect(wrapper.html()).to.have.string('string_with_key:')
  })
})
