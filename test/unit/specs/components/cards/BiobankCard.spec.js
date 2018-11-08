/* global describe it expect beforeEach */
import { shallowMount } from '@vue/test-utils'
import BiobankCard from '@/components/cards/BiobankCard'

describe('BiobankCard', () => {
  let propsData

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
  })

  it('should initialize the collapsed prop to true if none is passed', () => {
    const wrapper = shallowMount(BiobankCard, {propsData})
    expect(wrapper.props().initCollapsed).to.equal(true)
  })

  it('should use the passed collapsed setting if passed', () => {
    propsData.initCollapsed = false
    const wrapper = shallowMount(BiobankCard, {propsData})
    expect(wrapper.props().initCollapsed).to.equal(false)
  })

  it('should expose a list of collectionTypes', () => {
    const wrapper = shallowMount(BiobankCard, {propsData})
    expect(wrapper.vm.collectionTypes).to.equal('col-type-a, col-type-b')
  })
})
