import { mount } from '@vue/test-utils'
import CollectionViewGenerator from '../../../../../src/components/generators/CollectionViewGenerator.vue'

describe('CollectionView Generator', () => {
  it('can generate an mref based on categoricalmref or just mref', () => {
    const collection = {
      viewmodel: [{ label: 'test-categorical-mref', type: 'categoricalmref', value: ['a', 'b', 'c'] },
        { label: 'test-mref', type: 'mref', value: ['d', 'e', 'f'] }
      ]
    }

    const wrapper = mount(CollectionViewGenerator, { propsData: { collection } })

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
    const collection = {
      viewmodel: [{ label: 'test-hyperlink', type: 'hyperlink', value: 'https://test.com' }]
    }

    const wrapper = mount(CollectionViewGenerator, { propsData: { collection } })
    const html = wrapper.html().replace(/\s/gmi, '')

    expect(html.includes('>test-hyperlink<')).toBeTruthy()
    expect(html.includes('href="https://test.com"')).toBeTruthy()
  })

  it('defaults to rendering as string when type is omitted', () => {
    const collection = {
      viewmodel: [{ label: 'unknown-type', value: 'something very special' }]
    }

    const wrapper = mount(CollectionViewGenerator, { propsData: { collection } })
    const html = wrapper.html().replace(/\s/gmi, '')

    expect(html.includes('>unknown-type<')).toBeTruthy()
    expect(html.includes('>somethingveryspecial<')).toBeTruthy()
  })
})
