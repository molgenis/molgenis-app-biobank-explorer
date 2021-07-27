import { createBookmark } from '../../../../src/utils/bookmarkMapper'
import Router from '../../../../src/router'

jest.mock('../../../../src/router', () => ({
  name: 'Test', path: 'TestPath', push: jest.fn()
}))

describe('bookmark mapper', () => {
  it('can create a bookmark', () => {
    const filters = { country: ['AT'] }
    const selection = [{
      label: 'Ability to collect COVID-19 cases',
      value: 'bbmri-eric:ID:AT_MUG:collection:COVID19PROSPECTIVE'
    }]

    createBookmark(filters, selection)

    expect(Router.push).toHaveBeenCalledWith({ name: 'Test', path: 'TestPath', query: { cart: 'YmJtcmktZXJpYzpJRDpBVF9NVUc6Y29sbGVjdGlvbjpDT1ZJRDE5UFJPU1BFQ1RJVkU=', country: 'AT' } }, expect.anything())
  })
})
