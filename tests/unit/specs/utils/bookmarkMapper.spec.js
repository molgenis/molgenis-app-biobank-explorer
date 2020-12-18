import { createBookmark } from '../../../../src/utils/bookmarkMapper'

describe('bookmark mapper', () => {
  it('can create a bookmark', () => {
    const pushMock = jest.fn()
    const router = { name: 'Test', path: 'TestPath', push: pushMock }
    const filters = { country: ['AT'] }
    const selection = [{
      label: 'Ability to collect COVID-19 cases',
      value: 'bbmri-eric:ID:AT_MUG:collection:COVID19PROSPECTIVE'
    }]

    createBookmark(router, filters, selection)

    expect(pushMock).toHaveBeenCalledWith({ name: 'Test', path: 'TestPath', query: { cart: 'YmJtcmktZXJpYzpJRDpBVF9NVUc6Y29sbGVjdGlvbjpDT1ZJRDE5UFJPU1BFQ1RJVkU=', country: 'AT' } }, expect.anything())
  })
})
