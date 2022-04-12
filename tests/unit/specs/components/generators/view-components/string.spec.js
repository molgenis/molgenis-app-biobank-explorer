import { mount } from '@vue/test-utils'
import string from '../../../../../../src/components/generators/view-components/string.vue'

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
      expect(wrapper.vm.badgeColor).toBe('info')
    })

    it('can render the value as a badge if the attribute is present', () => {
      attribute = {
        label: 'Description:',
        value: 'test',
        badgeColor: 'red'
      }

      const wrapper = mount(string, { propsData: { attribute } })

      expect(wrapper.html().includes('Description:')).toBeTruthy()
      expect(wrapper.html().includes('<span class="badge rounded-pill mb-2 badge-red"')).toBeTruthy()
      expect(wrapper.vm.badgeColor).toBe('red')
    })

    it('can create a copy icon to copy a link to clipboard if the attribute is present', () => {
      attribute = {
        label: 'Description:',
        value: 'test',
        linkValue: 'http://test.com/123'
      }

      const wrapper = mount(string, { propsData: { attribute } })
      // remove whitespace and newlines for easy check
      const flattendHtml = wrapper.html().replace(/\s/gmi, '')

      expect(flattendHtml.includes('>Description:<')).toBeTruthy()
      expect(flattendHtml.includes('>test')).toBeTruthy()
      expect(flattendHtml.includes('class="fafa-clipboardml-1">')).toBeTruthy()
      expect(wrapper.find('.toast-container').isVisible()).toBeFalsy()
    })

    it('copy the link value on clipboard when the icon is clicked', async () => {
      jest.spyOn(navigator.clipboard, 'writeText')
      jest.useFakeTimers()
      attribute = {
        label: 'Description:',
        value: 'test',
        linkValue: 'http://test.com/123'
      }

      const wrapper = mount(string, { propsData: { attribute } })
      var toastContainer = wrapper.find('.toast-container')
      expect(toastContainer.isVisible()).toBeFalsy()
      expect(wrapper.vm.copiedValueShown).toBeFalsy()

      await wrapper.find('#copy-icon').trigger('click')
      expect(toastContainer.isVisible()).toBeTruthy()
      expect(wrapper.vm.copiedValueShown).toBeTruthy()
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(attribute.linkValue)

      jest.runAllTimers()
      expect(wrapper.vm.copiedValueShown).toBeFalsy()
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
