import { mount } from '@vue/test-utils'
import mref from '../../../../../../src/components/generators/view-components/longtext.vue'

let attribute

describe('Generator view-components', () => {
  describe('longtext', () => {
    beforeEach(() => {
      attribute = {}
    })

    it('can create a tr with a description with less than 500 characters', () => {
      attribute = {
        label: 'Description: ',
        value: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`
      }

      const wrapper = mount(mref, { propsData: { attribute } })

      // remove whitespace and newlines for easy check
      const flattendHtml = wrapper.html().replace(/\s/gmi, '')

      expect(flattendHtml.includes('>Description:<')).toBeTruthy()
      expect(flattendHtml.includes('>Lorem')).toBeTruthy()
      expect(flattendHtml.includes('laborum.<')).toBeTruthy()
    })

    it('can abbreviate a long text with a triple dot and show more', () => {
      attribute = {
        label: 'Description: ',
        value: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
Arcu odio ut sem nulla. Dolor sed viverra ipsum nunc aliquet. 
Sit amet purus gravida quis blandit. Faucibus nisl tincidunt eget nullam non. 
Tristique magna sit amet purus gravida. Tortor vitae purus faucibus ornare suspendisse sed nisi lacus sed. 
Pharetra convallis posuere morbi leo. Viverra aliquet eget sit amet tellus cras. 
Adipiscing at in tellus integer feugiat. Diam volutpat commodo sed egestas egestas fringilla. 
Mi ipsum faucibus vitae aliquet nec ullamcorper sit. Enim ut tellus elementum sagittis vitae. 
In fermentum et sollicitudin ac orci phasellus egestas tellus. Eu consequat ac felis donec et odio. 
Congue nisi vitae suscipit tellus mauris a diam. Aenean sed adipiscing diam donec adipiscing.
Suspendisse sed nisi lacus sed viverra tellus in hac. 
Proin fermentum leo vel orci porta non pulvinar neque laoreet. 
Sed tempus urna et pharetra pharetra massa massa ultricies. 
A lacus vestibulum sed arcu non odio euismod lacinia. 
Id semper risus in hendrerit. Nullam non nisi est sit amet facilisis magna. 
Ac auctor augue mauris augue neque gravida in. 
Pulvinar pellentesque habitant morbi tristique senectus et. 
Sed tempus urna et pharetra pharetra massa massa ultricies. 
Magna ac placerat vestibulum lectus mauris. 
Vel turpis nunc eget lorem dolor sed. 
Purus faucibus ornare suspendisse sed nisi lacus sed. 
Vulputate sapien nec sagittis aliquam malesuada bibendum arcu vitae.
Nisl nunc mi ipsum faucibus vitae aliquet nec. 
Risus pretium quam vulputate dignissim suspendisse in est ante.`
      }

      const wrapper = mount(mref, { propsData: { attribute } })
      const flattendHtml = wrapper.html().replace(/\s/gmi, '')

      // assert if it breaks down after 500 characters
      expect(flattendHtml.includes('eugiat.<')).toBeTruthy()

      // assert if it shows the showmore
      expect(flattendHtml.includes('...showmore')).toBeTruthy()
    })

    it('does not create a tr when attribute is empty', () => {
      const wrapper = mount(mref)
      const html = wrapper.html()
      expect(html).toBe('')
    })
  })
})
