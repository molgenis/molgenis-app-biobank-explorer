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
  let wrapper

  const clickHandler = jest.fn()

  beforeEach(() => {
    const propsData = {
      value: testCollections,
      cartSelectionText: `${testCollections.length} collection(s) selected`,
      clickHandler
    }
    wrapper = shallowMount(CartSelectionToast, { localVue, propsData })
  })

  it('Shows the cartSelection text', async () => {
    const html = wrapper.html()

    expect(html.includes(`${testCollections.length} collection(s) selected`)).toBeTruthy()
  })
})
