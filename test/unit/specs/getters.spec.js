import { expect } from 'chai'
import td from 'testdouble'
import getters from 'src/store/getters'

describe('getters', () => {
  afterEach(() => td.reset())

  describe('getFilteredCollections', () => {
    it('should return a list of objects containing biobank and collection ids', () => {
      const state = {
        biobanks: [
          {
            id: 'biobank_1',
            collections: [
              {
                id: 'collection_1'
              }
            ]
          },
          {
            id: 'biobank_2',
            collections:
              [
                {
                  id: 'collection_1'
                },
                {
                  id: 'collection_2'
                },
                {
                  id: 'collection_3'
                }
              ]
          }
        ]
      }

      const getFilteredBiobanks = td.function('getters.getFilteredBiobanks')
      td.when(getFilteredBiobanks(td.matchers.anything())).thenReturn(state.biobanks)
      td.replace(getters, 'getFilteredBiobanks', getFilteredBiobanks)

      const actual = getters.getFilteredCollections(state, getters)
      const expected = [
        {biobankId: 'biobank_1', collectionId: 'collection_1'},
        {biobankId: 'biobank_2', collectionId: 'collection_1'},
        {biobankId: 'biobank_2', collectionId: 'collection_2'},
        {biobankId: 'biobank_2', collectionId: 'collection_3'}
      ]

      expect(actual).to.deep.equal(expected)
    })
  })
})
