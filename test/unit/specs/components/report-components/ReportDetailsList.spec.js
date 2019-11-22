/* global describe it expect beforeEach */
import { shallowMount } from '@vue/test-utils'
import ReportDetailsList from '@/components/cards/ReportDetailsList'

describe('ReportDetailsList', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(ReportDetailsList,
      {
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
              }
            }
          }
      })
  })
  it('should initialize', () => {
    expect(wrapper.html()).to.have.string('<dl class="mg-report-details-list">')
  })
  it('should contain name as string', () => {
    expect(wrapper.html()).to.have.string('<span>Some Name</span>')
  })
  it('should contain email as email', () => {
    expect(wrapper.html()).to.have.string('<a href="mailto:myEmail@myWebsite.com"><em class="fa fa-paper-plane"></em> Email')
  })
  it('should contain website as url', () => {
    expect(wrapper.html()).to.have.string('<a href="http://myWebsite.com"><em class="fa fa-globe"></em> Website')
  })
  it('should contain phone number as phone type', () => {
    expect(wrapper.html()).to.have.string('<em class="fa fa-phone"></em> +1234567890')
  })
  it('should contain bool true value', () => {
    expect(wrapper.html()).to.have.string('<span class="badge badge-success">yes')
  })
  it('should contain bool false value', () => {
    expect(wrapper.html()).to.have.string('<span class="badge badge-danger">no')
  })
  it('should contain list with default color', () => {
    expect(wrapper.html()).to.have.string('<span class="badge badge-success">val1')
  })
  it('should contain list with other color', () => {
    expect(wrapper.html()).to.have.string('<span class="badge badge-primary">val3')
  })
})
