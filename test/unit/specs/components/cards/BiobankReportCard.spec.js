/* global describe it expect beforeEach */
import { shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import BiobankReportCard from '@/components/cards/BiobankReportCard'

describe('BiobankReportCard', () => {
  let store
  let mocks
  let stubs
  let biobankReport

  beforeEach(() => {
    biobankReport = {
      data: {
        collections: [],
        contact: {
          first_name: 'first_name',
          last_name: 'last_name',
          email: 'email',
          phone: 'phone',
          address: 'address',
          city: 'city',
          zip: 'zip'
        },
        country: {
          name: 'name'
        }
      },
      metadata: {}
    }

    store = new Vuex.Store({
      state: {
        biobankReport,
        route: {
          params: {
            id: 'my-id'
          }
        }
      },
      actions: {
        '__GET_BIOBANK_REPORT__': () => {}
      }
    })
    mocks = {
      $route: {
        query: 'some-query'
      }
    }
    stubs = ['router-link', 'router-view']
  })

  it('should initialize component', () => {
    const wrapper = shallowMount(BiobankReportCard, {mocks, stubs, store})
    expect(wrapper.html()).to.have.string('<div class="mg-biobank-card container">')
  })

  describe('computed', () => {
    describe('query', () => {
      it('should get query', () => {
        const wrapper = shallowMount(BiobankReportCard, {mocks, stubs, store})
        expect(wrapper.vm.query).to.equal('some-query')
      })
    })

    describe('collectionsData', () => {
      it('should fill collectionsData if available', () => {
        const wrapper = shallowMount(BiobankReportCard, {mocks, stubs, store})
        expect(wrapper.vm.collectionsData).to.deep.equal([])
      })
    })

    describe('collectionsData', () => {
      it('should fill contactInfo', () => {
        const wrapper = shallowMount(BiobankReportCard, {mocks, stubs, store})
        expect(wrapper.vm.contactInfo.email).to.deep.equal({'value': 'email', type: 'email'})
      })
    })
  })
})
