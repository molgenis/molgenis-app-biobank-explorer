import utils from '../../../../src/utils'

describe('Utilities', () => {
  describe('qualityAttributeSelector', () => {
    it('should build correct quality attributes selector for biobanks', () => {
      const type = 'bio'

      const actual = utils.qualityAttributeSelector(type)
      const expected = 'quality(id,standards(*),assess_level_bio(*),certification_number,certification_image_link,certification_report,label)'

      expect(actual).toBe(expected)
    })

    it('should build correct quality attributes selector for collections', () => {
      const type = 'col'

      const actual = utils.qualityAttributeSelector(type)
      const expected = 'quality(id,standards(*),assess_level_col(*),certification_number,certification_image_link,certification_report,label)'

      expect(actual).toBe(expected)
    })
  })

  describe('getUniqueIdArray', () => {
    it('should transform [1, 1, 2, 3, 2, 4, 5] to [1, 2, 3, 4, 5]', () => {
      const list = ['1', '1', '2', '3', '2', '4', '5']

      const actual = utils.getUniqueIdArray(list)
      const expected = ['1', '2', '3', '4', '5']

      expect(actual).toStrictEqual(expected)
    })
  })

  describe('createInQuery', () => {
    it('should return an empty array if the filters are empty', () => {
      const actual = utils.createInQuery('country', [])
      const expected = []

      expect(actual).toStrictEqual(expected)
    })

    it('should transform (country, [AT,BE]) to country=in=(AT,BE)', () => {
      const actual = utils.createInQuery('country', ['AT', 'BE'])
      const expected = [{ selector: 'country', comparison: '=in=', arguments: ['AT', 'BE'] }]

      expect(actual).toStrictEqual(expected)
    })
  })

  describe('createLikeQuery', () => {
    it('should return an empty array if the text is empty', () => {
      const actual = utils.createLikeQuery('diagnosis_available', '')
      const expected = []

      expect(actual).toStrictEqual(expected)
    })

    it('should transform (diagnosis_available, "cancer") to rsql object', () => {
      const actual = utils.createLikeQuery('diagnosis_available', 'cancer')
      const expected = [{ selector: 'diagnosis_available', comparison: '=like=', arguments: 'cancer' }]

      expect(actual).toStrictEqual(expected)
    })
  })

  describe('createTextSearchQuery', () => {
    it('should return a single query object if tokenization is omitted', () => {
      const actual = utils.createTextSearchQuery('diagnosis_available', 'hereditary disease')
      const expected = [{ selector: 'diagnosis_available', comparison: '=like=', arguments: 'hereditary disease' }]

      expect(actual).toStrictEqual(expected)
    })

    it('should transform (diagnosis_available, "hereditary disease") to rsql object with two queries, with tokenization', () => {
      const actual = utils.createTextSearchQuery('diagnosis_available', 'hereditary disease', true)
      const expected = {
        operator: 'AND',
        operands: [{ arguments: 'hereditary', comparison: '=like=', selector: 'diagnosis_available' },
          { arguments: 'disease', comparison: '=like=', selector: 'diagnosis_available' }]
      }

      expect(actual).toStrictEqual(expected)
    })
  })

  describe('diagnosisAvailableQuery', () => {
    it('should return an empty array if the filters are empty', () => {
      const actual = utils.diagnosisAvailableQuery([], 'diagnosis_available')
      const expected = []

      expect(actual).toStrictEqual(expected)
    })

    it('should return a separate query for aggregate codes if the filters have aggregate code', () => {
      const actual = utils.diagnosisAvailableQuery(['id:C15-C25', 'id:ORPHA:1000'], 'diagnosis_available')
      const expected = {
        operator: 'OR',
        operands: [{
          arguments: ['id:ORPHA:1000'],
          comparison: '=in=',
          selector: 'diagnosis_available'
        },
        {
          arguments: ['id:C15-C25'],
          comparison: '=in=',
          selector: 'diagnosis_available'
        }]
      }

      expect(actual).toStrictEqual(expected)
    })

    it('should return a comparison queries instead of =in= if satisfy all is true', () => {
      const actual = utils.diagnosisAvailableQuery(['id:C15-C25', 'id:ORPHA:1000'], 'diagnosis_available', true)
      const expected =
      {
        operator: 'AND',
        operands: [{
          arguments: 'id:ORPHA:1000',
          comparison: '==',
          selector: 'diagnosis_available'
        }, {
          arguments: ['id:C15-C25'],
          comparison: '=in=',
          selector: 'diagnosis_available'
        }]
      }
      expect(actual).toStrictEqual(expected)
    })
  })

  describe('removeFilterFromFilterArrayById', () => {
    it('should return an array of filter IDs without the selectedFilter', () => {
      const filters = [
        { id: 'filter1', name: 'filter 1' },
        { id: 'filter2', name: 'filter 2' },
        { id: 'filter3', name: 'filter 3' },
        { id: 'filter4', name: 'filter 4' },
        { id: 'filter5', name: 'filter 5' }
      ]
      const actual = utils.removeFilterFromFilterArrayById(filters, 'filter3')
      const expected = ['filter1', 'filter2', 'filter4', 'filter5']

      expect(actual).toStrictEqual(expected)
    })
  })
})
