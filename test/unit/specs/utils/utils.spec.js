import { expect } from 'chai'
import utils from 'src/utils'

describe('Utilities', () => {
  describe('filterToQuery', () => {
    it('should transform [NL, BE] to country==NL,country==BE', () => {
      const attribute = 'country'
      const filters = ['NL', 'BE']

      const actual = utils.filterToQueryPart(attribute, filters)
      const expected = 'country==NL,country==BE'

      expect(actual).to.equal(expected)
    })

    it('should transform [] to an empty string', () => {
      const attribute = 'country'
      const filters = []

      const actual = utils.filterToQueryPart(attribute, filters)
      const expected = ''

      expect(actual).to.equal(expected)
    })
  })

  describe('queryPartsToQuery', () => {
    it('should transform [country==NL,country==BE,,,diagnosis_available==C18] to country==NL,country==BE;diagnosis_available==C18', () => {
      const queryParts = ['country==NL,country==BE', '', '', 'diagnosis_available==C18']

      const actual = utils.queryPartsToQuery(queryParts)
      const expected = 'country==NL,country==BE;diagnosis_available==C18'

      expect(actual).to.equal(expected)
    })

    it('should transform [,materials==RNA,materials==DNA,,diagnosis_available==C18] to materials==RNA,materials==DNA;diagnosis_available==C18', () => {
      const queryParts = ['', 'materials==RNA,materials==DNA', '', 'diagnosis_available==C18']

      const actual = utils.queryPartsToQuery(queryParts)
      const expected = 'materials==RNA,materials==DNA;diagnosis_available==C18'

      expect(actual).to.equal(expected)
    })

    it('should transform [,,] to an empty string', () => {
      const queryParts = ['', '']

      const actual = utils.queryPartsToQuery(queryParts)
      const expected = ''

      expect(actual).to.equal(expected)
    })
  })
})
