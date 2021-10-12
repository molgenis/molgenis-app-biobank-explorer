import { mount } from '@vue/test-utils'
import CreateCollectionDetails from '../../../../../src/components/generators/CreateCollectionDetails'
import { createColumnKey } from '../../../../../src/utils/generatorUtils'

const propertyName = 'test_property'
const collection = {}
let property = {}

describe('Generator components', () => {
  describe('CreateCollectionDetails', () => {
    beforeEach(() => {
      collection[createColumnKey(propertyName)] = { value: [1, 2, 3, 4, 5] }
      property = { label: 'My test property:', column: propertyName }
    })

    it('can create a tr, based on a collection object and a given property', () => {
      const wrapper = mount(CreateCollectionDetails, { propsData: { collection, property } })

      expect(wrapper.html()).toBe(`<tr>
  <th scope="row" class="pr-1">My test property:</th>
  <td><span class="m-1 badge badge-info">1
      </span><span class="m-1 badge badge-info">2
      </span><span class="m-1 badge badge-info">3
      </span><span class="m-1 badge badge-info">4
      </span><span class="m-1 badge badge-info">5
      </span></td>
</tr>`)
    })
  })
})
