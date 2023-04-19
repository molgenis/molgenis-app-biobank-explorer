import { mount } from '@vue/test-utils'
import mref from '../../../../../../src/components/generators/view-components/mref.vue'

let attribute

describe('Generator view-components', () => {
  describe('mref', () => {
    beforeEach(() => {
      attribute = { }
    })

    it('can create a paragraph list for an mref attribute', () => {
      attribute = {
        label: 'Count: ',
        value: [1, 2, 3]
      }

      const wrapper = mount(mref, { propsData: { attribute } })

      // remove whitespace and newlines for easy check
      const flattendHtml = wrapper.html().replace(/\s/gmi, '')

      expect(flattendHtml.includes('>Count:<')).toBeTruthy()
      expect(flattendHtml.includes('>1,2,3<')).toBeTruthy()
    })

    it('can create a tr for a categorical mref attribute object with id/label/name and a uri', () => {
      attribute = {
        label: 'Count: ',
        value: [
          { id: 'myId', uri: 'https://id.com' },
          { name: 'myName', uri: 'https://name.com' },
          { label: 'myLabel', uri: 'https://label.com' }
        ]
      }

      const wrapper = mount(mref, { propsData: { attribute } })
      const html = wrapper.html()

      // assert if links are present
      expect(html.includes('href="https://id.com" target="_blank"')).toBeTruthy()
      expect(html.includes('href="https://name.com" target="_blank"')).toBeTruthy()
      expect(html.includes('href="https://label.com" target="_blank"')).toBeTruthy()

      // assert if id, label and name are present
      expect(html.includes('myId')).toBeTruthy()
      expect(html.includes('myName')).toBeTruthy()
      expect(html.includes('myLabel')).toBeTruthy()
    })

    it('does not create a tr when attribute is empty', () => {
      const wrapper = mount(mref)
      const html = wrapper.html()
      expect(html).toBe('')
    })
  })
})
