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
    expect(wrapper.html()).to.have.string('<div class="card biobank-card">')
  })

  describe('methods', () => {
    describe('showThisAttribute', () => {
      it('should show attribute if not in ignore list', () => {
        const wrapper = shallowMount(BiobankReportCard, {mocks, stubs, store})
        const attribute = {
          name: 'not_in_ignore_list'
        }
        expect(wrapper.vm.showThisAttribute(attribute)).to.equal(true)
      })

      it('should not show attribute if in ignore list', () => {
        const wrapper = shallowMount(BiobankReportCard, {mocks, stubs, store})
        const attribute = {
          name: 'other_standards'
        }
        expect(wrapper.vm.showThisAttribute(attribute)).to.equal(false)
      })
    })

    describe('singleReferenceType', () => {
      it('true if type is XREF', () => {
        const wrapper = shallowMount(BiobankReportCard, {mocks, stubs, store})
        expect(wrapper.vm.singleReferenceType('XREF')).to.equal(true)
      })

      it('true if type is CATEGORICAL', () => {
        const wrapper = shallowMount(BiobankReportCard, {mocks, stubs, store})
        expect(wrapper.vm.singleReferenceType('CATEGORICAL')).to.equal(true)
      })

      it('false if type is some thing else ', () => {
        const wrapper = shallowMount(BiobankReportCard, {mocks, stubs, store})
        expect(wrapper.vm.singleReferenceType('some thing else')).to.equal(false)
      })
    })

    describe('multipleReferenceType', () => {
      it('true if type is MREF', () => {
        const wrapper = shallowMount(BiobankReportCard, {mocks, stubs, store})
        expect(wrapper.vm.multipleReferenceType('MREF')).to.equal(true)
      })

      it('true if type is CATEGORICAL_MREF', () => {
        const wrapper = shallowMount(BiobankReportCard, {mocks, stubs, store})
        expect(wrapper.vm.multipleReferenceType('CATEGORICAL_MREF')).to.equal(true)
      })

      it('true if type is ONE_TO_MANY', () => {
        const wrapper = shallowMount(BiobankReportCard, {mocks, stubs, store})
        expect(wrapper.vm.multipleReferenceType('ONE_TO_MANY')).to.equal(true)
      })

      it('false if type is some thing else ', () => {
        const wrapper = shallowMount(BiobankReportCard, {mocks, stubs, store})
        expect(wrapper.vm.multipleReferenceType('some thing else')).to.equal(false)
      })
    })

    describe('getSingleRefLabel', () => {
      it('should use the labelAttribute to fetch the label form the type', () => {
        const wrapper = shallowMount(BiobankReportCard, {mocks, stubs, store})
        const attribute = {
          refEntity: {
            labelAttribute: 'labelAttribute'
          }
        }
        const ref = {
          labelAttribute: 'some-label'
        }
        expect(wrapper.vm.getSingleRefLabel(attribute, ref)).to.equal('some-label')
      })
    })

    describe('getMultiRefLabels', () => {
      it('should use the labelAttribute to fetch all label and join then into a string', () => {
        const wrapper = shallowMount(BiobankReportCard, {mocks, stubs, store})
        const attribute = {
          refEntity: {
            labelAttribute: 'labelAttribute'
          }
        }
        const refs = [
          {labelAttribute: 'some-label'},
          {labelAttribute: 'other-label'}
        ]
        expect(wrapper.vm.getMultiRefLabels(attribute, refs)).to.equal('some-label, other-label')
      })
    })

    describe('generateQualityLabel', () => {
      it('should use label attribute if label is not "Others"', () => {
        const wrapper = shallowMount(BiobankReportCard, {mocks, stubs, store})
        const quality = {
          label: 'some label'
        }
        expect(wrapper.vm.generateQualityLabel(quality)).to.equal('some label')
      })

      it('should use certification_number if label is "Others"', () => {
        const wrapper = shallowMount(BiobankReportCard, {mocks, stubs, store})
        const quality = {
          label: 'Others',
          certification_number: '123-456'
        }
        expect(wrapper.vm.generateQualityLabel(quality)).to.equal('123-456')
      })
    })
  })

  describe('computed', () => {
    describe('collectionTypes', () => {
      it('should generate a list of collection types', () => {
        biobankReport.data.collections = [
          {
            type: [{
              label: 'type-1'
            }]
          },
          {
            type: [{
              label: 'type-2'
            }]
          }
        ]
        const wrapper = shallowMount(BiobankReportCard, {mocks, stubs, store})
        expect(wrapper.vm.collectionTypes).to.equal('type-1, type-2')
      })
    })
  })
})
