/* global describe it expect beforeEach */
import { shallowMount } from '@vue/test-utils'
import BiobankCard from '@/components/cards/BiobankCard'

describe('BiobankCard', () => {
  let propsData
  let stubs

  beforeEach(() => {
    propsData = {
      biobank: {
        id: 'biobank-1',
        collections: [{
          type: [{label: 'col-type-a'}],
          sub_collections: [{
            type: [{label: 'col-type-b'}],
            sub_collections: []
          }]
        }]
      }
    }
    stubs = ['router-link', 'router-view']
  })

  it('should initialize the collapsed prop to true if none is passed', () => {
    const wrapper = shallowMount(BiobankCard, {propsData, stubs})
    expect(wrapper.props().initCollapsed).to.equal(true)
  })

  it('should use the passed collapsed setting if passed', () => {
    propsData.initCollapsed = false
    const wrapper = shallowMount(BiobankCard, {propsData, stubs})
    expect(wrapper.props().initCollapsed).to.equal(false)
  })

  it('should expose a list of collectionTypes', () => {
    const wrapper = shallowMount(BiobankCard, {propsData, stubs})
    expect(wrapper.vm.collectionTypes).to.equal('col-type-a, col-type-b')
  })
  it('should expose a list of covid19 types if available', () => {
    propsData.biobank.covid19biobank = [{label: 'Member of the COVID-19 network'}, {name: 'COVID-19'}]
    const wrapper = shallowMount(BiobankCard, {propsData, stubs})
    expect(wrapper.vm.availableCovidTypes).to.equal('Member of the COVID-19 network, COVID-19')
  })
  it('should return nothing if covid types are not available', () => {
    const wrapper = shallowMount(BiobankCard, {propsData, stubs})
    expect(wrapper.vm.availableCovidTypes).to.equal(undefined)
  })
})
