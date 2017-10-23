import { expect } from 'chai'
import { getFilteredCollections, getHumanReadableString } from 'src/store/utils/negotiator-utils'

const getInitialState = () => {
  return {
    search: '',
    country: {
      filters: []
    },
    materials: {
      filters: []
    },
    standards: {
      filters: []
    },
    diagnosis_available: {
      filters: []
    }
  }
}

describe('Negotiator Query utilities', () => {
  describe('getFilteredCollections', () => {
    it('should return a list of objects containing biobank and collection ids', () => {
      const biobanks = [
        {
          id: 'biobank_1',
          collections: [{id: 'collection_1'}]
        },
        {
          id: 'biobank_2',
          collections:
            [
              {id: 'collection_1'},
              {id: 'collection_2'},
              {id: 'collection_3'}
            ]
        }
      ]

      const actual = getFilteredCollections(biobanks)
      const expected = [
        {biobankId: 'biobank_1', collectionId: 'collection_1'},
        {biobankId: 'biobank_2', collectionId: 'collection_1'},
        {biobankId: 'biobank_2', collectionId: 'collection_2'},
        {biobankId: 'biobank_2', collectionId: 'collection_3'}
      ]

      expect(actual).to.deep.equal(expected)
    })
  })

  describe('getHumanReadableString', () => {
    let state = getInitialState()
    afterEach(() => { state = getInitialState() })

    it('should generate a human readable string with only a free text filter', () => {
      state.search = 'this is a free text search'
      const actual = getHumanReadableString(state)
      const expected = 'Free text search contains this is a free text search'

      expect(actual).to.equal(expected)
    })

    it('should generate a human readable string with only a country filter', () => {
      state.country.filters.push('NL', 'BE')

      const actual = getHumanReadableString(state)
      const expected = 'selected countries are NL,BE'

      expect(actual).to.equal(expected)
    })

    it('should generate a human readable string with only a material type filter', () => {
      state.materials.filters.push('PLASMA', 'RNA')

      const actual = getHumanReadableString(state)
      const expected = 'selected material types are PLASMA,RNA'

      expect(actual).to.equal(expected)
    })

    it('should generate a human readable string with only a standards filter', () => {
      state.standards.filters.push('cen-ts-16826-1-2015')

      const actual = getHumanReadableString(state)
      const expected = 'selected standards are cen-ts-16826-1-2015'

      expect(actual).to.equal(expected)
    })

    it('should generate a human readable string with only a disease type filter', () => {
      state.diagnosis_available.filters.push(
        {id: '1', label: 'small disease'},
        {id: '2', label: 'big disease'}
      )

      const actual = getHumanReadableString(state)
      const expected = 'selected disease types are small disease,big disease'

      expect(actual).to.equal(expected)
    })

    it('should generate a human readable string with all filters', () => {
      state.search = 'this is a free text search'
      state.country.filters.push('NL', 'BE')
      state.materials.filters.push('PLASMA', 'RNA')
      state.standards.filters.push('cen-ts-16826-1-2015')
      state.diagnosis_available.filters.push(
        {id: '1', label: 'small disease'},
        {id: '2', label: 'big disease'}
      )

      const actual = getHumanReadableString(state)
      const expected = 'Free text search contains this is a free text search and selected countries are NL,BE and selected material types are PLASMA,RNA and selected standards are cen-ts-16826-1-2015 and selected disease types are small disease,big disease'

      expect(actual).to.equal(expected)
    })
  })
})
