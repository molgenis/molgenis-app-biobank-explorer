import { mount } from '@vue/test-utils'
import ViewGenerator from '../../../../../src/components/generators/ViewGenerator.vue'

describe('CollectionView Generator', () => {
  it('can generate an mref based on categoricalmref or just mref', () => {
    const viewmodel = {
      attributes: [{ label: 'test-categorical-mref', type: 'categoricalmref', value: ['a', 'b', 'c'] },
        { label: 'test-mref', type: 'mref', value: ['d', 'e', 'f'] }
      ]
    }

    const wrapper = mount(ViewGenerator, { propsData: { viewmodel } })

    // flatten html so be can better assess if the value is between tags
    const html = wrapper.html().replace(/\s/gmi, '')

    // check if label rendered:
    expect(html.includes('>test-categorical-mref<')).toBeTruthy()

    // check if values rendered:
    expect(html.includes('>a<')).toBeTruthy()
    expect(html.includes('>b<')).toBeTruthy()
    expect(html.includes('>c<')).toBeTruthy()

    // check mref
    expect(html.includes('>test-mref<')).toBeTruthy()
    expect(html.includes('>d<')).toBeTruthy()
    expect(html.includes('>e<')).toBeTruthy()
    expect(html.includes('>f<')).toBeTruthy()
  })

  it('can generate a hyperlink', () => {
    const viewmodel = { attributes: [{ label: 'test-hyperlink', type: 'hyperlink', value: 'https://test.com' }] }

    const wrapper = mount(ViewGenerator, { propsData: { viewmodel } })
    const html = wrapper.html().replace(/\s/gmi, '')

    expect(html.includes('>test-hyperlink<')).toBeTruthy()
    expect(html.includes('href="https://test.com"')).toBeTruthy()
  })

  it('defaults to rendering as string when type is omitted', () => {
    const viewmodel = { attributes: [{ label: 'unknown-type', value: 'something very special' }] }

    const wrapper = mount(ViewGenerator, { propsData: { viewmodel } })
    const html = wrapper.html().replace(/\s/gmi, '')

    expect(html.includes('>unknown-type<')).toBeTruthy()
    expect(html.includes('>somethingveryspecial<')).toBeTruthy()
  })
})
