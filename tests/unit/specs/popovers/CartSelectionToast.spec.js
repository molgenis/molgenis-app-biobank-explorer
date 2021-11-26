import { createLocalVue, shallowMount } from '@vue/test-utils'
import BootstrapVue from 'bootstrap-vue'
import CartSelectionToast from '../../../../src/components/popovers/CartSelectionToast'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

const testCollections = [
  { name: 'Collection A', id: 'a' },
  { name: 'Collection B', id: 'b' },
  { name: 'Collection C', id: 'c' },
  { name: 'Collection D', id: 'd' }
]

describe('CartSelectionToast', () => {
  let wrapper, propsData

  const clickHandler = jest.fn()

  beforeEach(() => {
    propsData = {
      value: testCollections,
      cartSelectionText: `${testCollections.length} collection(s) selected`,
      clickHandler
    }
    wrapper = shallowMount(CartSelectionToast, { localVue, propsData })
  })

  it('Shows the cartSelection text', () => {
    const html = wrapper.html()

    expect(html.includes(`${testCollections.length} collection(s) selected`)).toBeTruthy()
  })

  it('Shows the labels from the given list when previewToggle is true', async () => {
    wrapper = shallowMount(CartSelectionToast, { localVue, propsData, data: () => ({ previewToggle: true }) })

    const html = wrapper.html()

    for (const collection of testCollections) {
      expect(html.includes(collection.name)).toBeTruthy()
    }
  })

  it('will return a new array without the removed collection', async () => {
    const expected = testCollections.filter(tc => tc.name !== 'Collection C')
    wrapper.vm.removeItem('Collection C')

    expect(wrapper.emitted().input[0][0]).toEqual(expected)
  })
})
