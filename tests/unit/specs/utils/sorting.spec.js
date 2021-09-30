import { sortCollectionsByName } from '../../../../src/utils/sorting'

describe('sorting', () => {
  describe('sortCollectionsByName', () => {
    it('can sort alphabetically', () => {
      const unsortedList = [{ name: 'Zigbee' }, { name: 'Cornelius' }, { name: 'Aria' }, { name: 'Yahoo' }]
      const sortedByName = sortCollectionsByName(unsortedList).map(item => item.name)
      expect(sortedByName).toMatchObject(['Aria', 'Cornelius', 'Yahoo', 'Zigbee'])
    })
  })
})
