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
      expect(wrapper.html().includes('<span class="badge badge-red"')).toBeTruthy()
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
      expect(flattendHtml.includes('class="toast-body">Copiedhttp://test.com/123')).toBeTruthy()
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
      expect(wrapper.find('.toast-container').isVisible()).toBeFalsy()
      expect(wrapper.vm.copyPidShown).toBeFalsy()

      await wrapper.find('#copy-icon').trigger('click')
      expect(wrapper.vm.copyPidShown).toBeTruthy()
      expect(wrapper.find('.toast-container').isVisible()).toBeTruthy()
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(attribute.linkValue)

      jest.runAllTimers()
      expect(wrapper.vm.copyPidShown).toBeFalsy()
      // expect(wrapper.find('.toast-container').isVisible()).toBeFalsy()
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
