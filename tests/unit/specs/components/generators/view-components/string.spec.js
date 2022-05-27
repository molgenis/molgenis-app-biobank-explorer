import string from '../../../../../../src/components/generators/view-components/string.vue'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'

const localVue = createLocalVue()

localVue.use(Vuex)

let attribute

Object.assign(navigator, {
  clipboard: {
    writeText: () => {}
  }
})

describe('Generator view-components', () => {
  describe('string', () => {
    beforeEach(() => {
      attribute = {}
    })

    it('can create a tr with a label and a value', () => {
      attribute = {
        label: 'Description: ',
        value: 'test'
      }

      const wrapper = mount(string, { propsData: { attribute } })

      // remove whitespace and newlines for easy check
      const flattendHtml = wrapper.html().replace(/\s/gmi, '')

      expect(flattendHtml.includes('>Description:<')).toBeTruthy()
      expect(flattendHtml.includes('>test')).toBeTruthy()
    })

    it('can create a copy icon to copy a link to clipboard if the attribute is present', () => {
      attribute = {
        label: 'Description:',
        value: 'test',
        linkValue: 'http://test.com/123'
      }

      const wrapper = mount(string, { propsData: { attribute }, directives: { 'b-tooltip': () => {} } })
      // remove whitespace and newlines for easy check
      const flattendHtml = wrapper.html().replace(/\s/gmi, '')

      expect(flattendHtml.includes('>Description:<')).toBeTruthy()
      expect(flattendHtml.includes('>test')).toBeTruthy()
      expect(flattendHtml.includes('class="fafa-clipboardml-1">')).toBeTruthy()
    })

    it('set notification message when the icon is clicked', async () => {
      const SetNotification = jest.fn()
      const store = new Vuex.Store({
        mutations: {
          SetNotification
        }
      })

      jest.spyOn(navigator.clipboard, 'writeText')
      attribute = {
        label: 'Description:',
        value: 'test',
        linkValue: 'http://test.com/123'
      }

      const wrapper = mount(string, { propsData: { attribute }, store, localVue, directives: { 'b-tooltip': () => {} } })
      await wrapper.find('#copy-icon').trigger('click')
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(attribute.linkValue)
      expect(SetNotification).toHaveBeenCalledWith(expect.anything(), `Copied ${attribute.linkValue}`)
    })

    it('use alternatives values as label', () => {
      attribute = {
        label: 'Label: ',
        name: 'Name: ',
        id: 'ID: ',
        value: 'test'
      }

      const wrapper = mount(string, { propsData: { attribute } })
      expect(wrapper.vm.displayName(attribute)).toBe(attribute.label)

      attribute.label = undefined
      expect(wrapper.vm.displayName(attribute)).toBe(attribute.name)

      attribute.name = undefined
      expect(wrapper.vm.displayName(attribute)).toBe(attribute.id)
    })

    it('does not create a tr when attribute is empty', () => {
      const wrapper = mount(string)
      const html = wrapper.html()
      expect(html).toBe('')
    })
  })
})
