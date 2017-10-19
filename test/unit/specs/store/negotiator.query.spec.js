import { expect } from 'chai'
import { getFilteredCollections, getHumanReadableString } from 'src/store/utils/negotiator.query'
import getters from 'src/store/getters'
import td from 'testdouble'

const getInitialState = () => {
  return {
    search: '',
    filters: {
      countries: {selectedOptions: []},
      material_types: {selectedOptions: []},
      quality: {selectedOptions: []}
    }
  }
}

describe('Negotiator Query utilities', () => {
  describe('getFilteredCollections', () => {
    it('should return a list of objects containing biobank and collection ids', () => {
      const state = {
        biobanks: [
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
      }

      const getFilteredBiobanks = td.function('getters.getFilteredBiobanks')
      td.when(getFilteredBiobanks(td.matchers.anything())).thenReturn(state.biobanks)
      td.replace(getters, 'getFilteredBiobanks', getFilteredBiobanks)

      const actual = getFilteredCollections(state, getters)
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

    it('should generate a human readable string with only a free text search', () => {
      state.search = 'this is a free text search'
      const actual = getHumanReadableString(state)
      const expected = 'Free text search contains this is a free text search'

      expect(actual).to.equal(expected)
    })

    it('should generate a human readable string with only a country search', () => {
      state.filters.countries.selectedOptions.push('NL', 'BE')

      const actual = getHumanReadableString(state)
      const expected = 'selected countries are NL,BE'

      expect(actual).to.equal(expected)
    })

    it('should generate a human readable string with only a material type search', () => {
      state.filters.material_types.selectedOptions.push('PLASMA', 'RNA')

      const actual = getHumanReadableString(state)
      const expected = 'selected material_types are PLASMA,RNA'

      expect(actual).to.equal(expected)
    })

    it('should generate a human readable string with only a quality search', () => {
      state.filters.quality.selectedOptions.push('cen-ts-16826-1-2015')

      const actual = getHumanReadableString(state)
      const expected = 'selected qualities are cen-ts-16826-1-2015'

      expect(actual).to.equal(expected)
    })

    it('should generate a human readable string with all searches', () => {
      state.search = 'this is a free text search'
      state.filters.countries.selectedOptions.push('NL', 'BE')
      state.filters.material_types.selectedOptions.push('PLASMA', 'RNA')
      state.filters.quality.selectedOptions.push('cen-ts-16826-1-2015')

      const actual = getHumanReadableString(state)
      const expected = 'Free text search contains this is a free text search and selected countries are NL,BE and selected material_types are PLASMA,RNA and selected qualities are cen-ts-16826-1-2015'

      expect(actual).to.equal(expected)
    })
  })
})
