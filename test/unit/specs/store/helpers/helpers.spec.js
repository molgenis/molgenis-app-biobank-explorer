import { expect } from 'chai'
import helpers, {
  CODE_REGEX,
  filterCollectionTree
} from '../../../../../src/store/helpers'

const getInitialState = () => {
  return {
    search: '',
    country: {
      filters: []
    },
    materials: {
      filters: []
    },
    collection_quality: {
      filters: [],
      collections: []
    },
    biobank_quality: {
      filters: [],
      biobanks: []
    },
    diagnosis_available: {
      filters: []
    },
    type: {
      filters: []
    },
    covid19: {
      filters: []
    },
    dataType: {
      filters: []
    },
    showCountryFacet: true
  }
}

describe('store', () => {
  describe('Vuex store helper functions', () => {
    describe('filterCollectionTree', () => {
      it('should filter collections with matching IDs', () => {
        const collections = [
          {id: 1, sub_collections: []},
          {id: 2, sub_collections: []},
          {id: 3, sub_collections: []},
          {id: 4, sub_collections: []},
          {id: 5, sub_collections: []}
        ]
        const expected = [
          {id: 2, sub_collections: []},
          {id: 4, sub_collections: []}
        ]
        expect(filterCollectionTree([2, 4], collections)).to.deep.eq(expected)
      })
      it('should filter subcollections', () => {
        expect(filterCollectionTree([2, 4], [{
          id: 1,
          sub_collections: [
            {id: 2, sub_collections: []},
            {id: 3, sub_collections: []},
            {id: 4, sub_collections: []},
            {id: 5, sub_collections: []}
          ]
        }])).to.deep.eq([{
          id: 1,
          sub_collections: [
            {id: 2, sub_collections: []},
            {id: 4, sub_collections: []}
          ]
        }])
      })
      it('should filter deeply nested tree of collections', () => {
        expect(filterCollectionTree([2, 4], [{
          id: 1,
          sub_collections: [{
            id: 2,
            sub_collections: [{
              id: 3,
              sub_collections: [{
                id: 4,
                sub_collections: [{
                  id: 5, sub_collections: []
                }]
              }]
            }]
          }]
        }])).to.deep.eq([{
          id: 1,
          sub_collections: [{
            id: 2,
            sub_collections: [{
              id: 3,
              sub_collections: [{
                id: 4,
                sub_collections: []
              }]
            }]
          }]
        }])
      })
    })

    describe('Code regex', () => {
      it('should match single uppercase character', () => {
        expect(CODE_REGEX.test('A')).to.eq(true)
      })

      it('should be case-insensitive', () => {
        expect(CODE_REGEX.flags).to.eq('i')
      })

      it('should match chapter code', () => {
        expect(CODE_REGEX.test('A10-A12')).to.eq(true)
      })

      it('should match top level chapter code', () => {
        expect(CODE_REGEX.test('XIX')).to.eq(true)
      })

      it('should match disease code', () => {
        expect(CODE_REGEX.test('A10.001')).to.eq(true)
      })

      it('should not match other query string', () => {
        expect(CODE_REGEX.test('he')).to.eq(false)
      })
    })

    describe('createDiagnosisLabelQuery', () => {
      it('should create a label search query', () => {
        const query = 'search awesome things'
        const actual = helpers.createDiagnosisLabelQuery(query)
        const expected = 'label=q=\'search awesome things\''

        expect(actual).to.equal(expected)
      })
    })

    describe('createDiagnosisCodeQuery', () => {
      it('should create a code like query', () => {
        const query = 'A01'
        const actual = helpers.createDiagnosisCodeQuery(query)
        const expected = 'code=like=A01'

        expect(actual).to.equal(expected)
      })

      it('should uppercase the query', () => {
        const query = 'xix'
        const actual = helpers.createDiagnosisCodeQuery(query)
        const expected = 'code=like=XIX'

        expect(actual).to.equal(expected)
      })
    })

    describe('createRSQLQuery', () => {
      let state = getInitialState()
      afterEach(() => { state = getInitialState() })

      it('should create a query with only a country filter', () => {
        state.country.filters.push('NL', 'BE')

        const actual = helpers.createRSQLQuery(state)
        const expected = 'country=in=(NL,BE)'

        expect(actual).to.equal(expected)
      })

      it('should create a query with only a materials filter', () => {
        state.materials.filters.push('RNA', 'DNA')

        const actual = helpers.createRSQLQuery(state)
        const expected = 'materials=in=(RNA,DNA)'

        expect(actual).to.equal(expected)
      })

      it('should create a query with only a collection quality filter', () => {
        state.collection_quality.collections.push('collection1')

        const actual = helpers.createRSQLQuery(state)
        const expected = 'id=in=(collection1)'

        expect(actual).to.equal(expected)
      })

      it('should create a query with only a disease type filter', () => {
        state.diagnosis_available.filters.push(
          {id: 'urn:miriam:id:disease-1', code: 'C01', label: 'small disease'},
          {id: 'urn:miriam:id:disease-2', code: 'C02', label: 'medium disease'},
          {id: 'urn:miriam:id:disease-3', code: 'C03', label: 'big disease'}
        )

        const actual = helpers.createRSQLQuery(state)
        const expected = 'diagnosis_available=in=(urn:miriam:id:disease-1,urn:miriam:id:disease-2,urn:miriam:id:disease-3)'

        expect(actual).to.equal(expected)
      })

      it('should create a query with no filters and no search', () => {
        const actual = helpers.createRSQLQuery(state)
        const expected = ''

        expect(actual).to.equal(expected)
      })

      it('should create a query with only a search', () => {
        state.search = 'test search'

        const actual = helpers.createRSQLQuery(state)
        const expected = 'name=q=\'test search\',id=q=\'test search\',acronym=q=\'test search\''

        expect(actual).to.equal(expected)
      })

      it('should create a query with filters and a search', () => {
        state.country.filters.push('NL', 'BE')
        state.search = 'test search'

        const actual = helpers.createRSQLQuery(state)
        const expected = 'country=in=(NL,BE);(name=q=\'test search\',id=q=\'test search\',acronym=q=\'test search\')'

        expect(actual).to.equal(expected)
      })
    })

    describe('createNegotiatorQueryBody', () => {
      it('should generate a javascript object containing URL, collections, human readable, entityType, rsql, and an nToken', () => {
        const getters = {
          rsql: 'long rsql string',
          biobanks: [
            {
              id: 'biobank-1',
              collections: [
                {id: 'collection-1'},
                {id: 'collection-2'}
              ]
            },
            {
              id: 'biobank-2',
              collections: [
                {id: 'collection-3'},
                {id: 'collection-4'}
              ]
            }
          ]
        }
        const state = {
          search: 'free text search',
          country: {
            filters: ['NL', 'BE']
          },
          materials: {
            filters: ['RNA']
          },
          collection_quality: {
            filters: ['eric']
          },
          type: {
            filters: ['type']
          },
          dataType: {
            filters: ['dataType']
          },
          diagnosis_available: {
            filters: [
              {label: 'small disease'},
              {label: 'medium disease'},
              {label: 'big disease'}
            ]
          },
          nToken: '2837538B50189SR237489X14098A2374'
        }

        const actual = helpers.createNegotiatorQueryBody(state, getters, 'http://test.com?id=1&nToken=2837538B50189SR237489X14098A2374')
        const expected = {
          URL: 'http://test.com?id=1',
          collections: [
            {biobankId: 'biobank-1', collectionId: 'collection-1'},
            {biobankId: 'biobank-1', collectionId: 'collection-2'},
            {biobankId: 'biobank-2', collectionId: 'collection-3'},
            {biobankId: 'biobank-2', collectionId: 'collection-4'}
          ],
          humanReadable: 'Free text search contains free text search and selected countries are NL,BE and selected material types are RNA and selected collection quality standards are eric and selected collection types are type and selected data types are dataType and selected disease types are small disease,medium disease,big disease',
          nToken: state.nToken,
          entityId: 'eu_bbmri_eric_collections',
          rsql: 'long rsql string'
        }

        expect(actual).to.deep.equal(expected)
      })
    })

    describe('getNegotiatorQueryObjects', () => {
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

        const actual = helpers.getNegotiatorQueryObjects(biobanks)
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
        const actual = helpers.getHumanReadableString(state)
        const expected = 'Free text search contains this is a free text search'

        expect(actual).to.equal(expected)
      })

      it('should generate a human readable string with only a country filter', () => {
        state.country.filters.push('NL', 'BE')

        const actual = helpers.getHumanReadableString(state)
        const expected = 'selected countries are NL,BE'

        expect(actual).to.equal(expected)
      })

      it('should generate a human readable string with only a material type filter', () => {
        state.materials.filters.push('PLASMA', 'RNA')

        const actual = helpers.getHumanReadableString(state)
        const expected = 'selected material types are PLASMA,RNA'

        expect(actual).to.equal(expected)
      })

      it('should generate a human readable string with only a collection quality filter', () => {
        state.collection_quality.filters.push('eric')

        const actual = helpers.getHumanReadableString(state)
        const expected = 'selected collection quality standards are eric'

        expect(actual).to.equal(expected)
      })

      it('should generate a human readable string with only a disease type filter', () => {
        state.diagnosis_available.filters.push(
          {id: '1', label: 'small disease'},
          {id: '2', label: 'big disease'}
        )

        const actual = helpers.getHumanReadableString(state)
        const expected = 'selected disease types are small disease,big disease'

        expect(actual).to.equal(expected)
      })

      it('should generate a human readable string with all filters', () => {
        state.search = 'this is a free text search'
        state.country.filters.push('NL', 'BE')
        state.materials.filters.push('PLASMA', 'RNA')
        state.collection_quality.filters.push('eric')
        state.diagnosis_available.filters.push(
          {id: '1', label: 'small disease'},
          {id: '2', label: 'big disease'}
        )

        const actual = helpers.getHumanReadableString(state)
        const expected = 'Free text search contains this is a free text search and selected countries are NL,BE and selected material types are PLASMA,RNA and selected collection quality standards are eric and selected disease types are small disease,big disease'

        expect(actual).to.equal(expected)
      })
    })
  })
})
