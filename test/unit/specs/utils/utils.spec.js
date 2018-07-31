import { expect } from 'chai'
import utils from '../../../../src/utils'

describe('Utilities', () => {
  describe('queryPartsToQuery', () => {
    it('should transform [country==NL,country==BE,,,diagnosis_available==C18] to (country==NL,country==BE);(diagnosis_available==C18)', () => {
      const queryParts = ['country==NL,country==BE', '', '', 'diagnosis_available==C18']

      const actual = utils.queryPartsToQuery(queryParts)
      const expected = '(country==NL,country==BE);(diagnosis_available==C18)'

      expect(actual).to.equal(expected)
    })

    it('should transform [,materials==RNA,materials==DNA,,diagnosis_available==C18] to (materials==RNA,materials==DNA);(diagnosis_available==C18)', () => {
      const queryParts = ['', 'materials==RNA,materials==DNA', '', 'diagnosis_available==C18']

      const actual = utils.queryPartsToQuery(queryParts)
      const expected = '(materials==RNA,materials==DNA);(diagnosis_available==C18)'

      expect(actual).to.equal(expected)
    })

    it('should transform [,,] to an empty string', () => {
      const queryParts = ['', '']

      const actual = utils.queryPartsToQuery(queryParts)
      const expected = ''

      expect(actual).to.equal(expected)
    })
  })

  describe('getUniqueIdArray', () => {
    it('should transform [1, 1, 2, 3, 2, 4, 5] to [1, 2, 3, 4, 5]', () => {
      const list = ['1', '1', '2', '3', '2', '4', '5']

      const actual = utils.getUniqueIdArray(list)
      const expected = ['1', '2', '3', '4', '5']

      expect(actual).to.deep.equal(expected)
    })
  })

  describe('createInQuery', () => {
    it('should return an empty string if the filters are empty', () => {
      const actual = utils.createInQuery('country', [])
      const expected = ''

      expect(actual).to.equal(expected)
    })

    it('should transform (country, [AT,BE]) to country=in=(AT,BE)', () => {
      const actual = utils.createInQuery('country', ['AT', 'BE'])
      const expected = 'country=in=(AT,BE)'

      expect(actual).to.equal(expected)
    })
  })

  describe('removeFilterFromFilterArrayById', () => {
    it('should return an array of filter IDs without the selectedFilter', () => {
      const filters = [
        {id: 'filter1', name: 'filter 1'},
        {id: 'filter2', name: 'filter 2'},
        {id: 'filter3', name: 'filter 3'},
        {id: 'filter4', name: 'filter 4'},
        {id: 'filter5', name: 'filter 5'}
      ]
      const actual = utils.removeFilterFromFilterArrayById(filters, 'filter3')
      const expected = ['filter1', 'filter2', 'filter4', 'filter5']

      expect(actual).to.deep.equal(expected)
    })
  })
})
