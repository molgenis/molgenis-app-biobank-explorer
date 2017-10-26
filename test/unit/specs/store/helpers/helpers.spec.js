import { expect } from 'chai'
import helpers from 'src/store/helpers'

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

describe('Vuex store helper functions', () => {
  describe('createRSQLQuery', () => {
    let state = getInitialState()
    afterEach(() => { state = getInitialState() })

    it('should create a query with only a country filter', () => {
      state.country.filters.push('NL', 'BE')

      const actual = helpers.createRSQLQuery(state)
      const expected = '&q=(country=in=(NL,BE))'

      expect(actual).to.equal(expected)
    })

    it('should create a query with only a materials filter', () => {
      state.materials.filters.push('RNA', 'DNA')

      const actual = helpers.createRSQLQuery(state)
      const expected = '&q=(materials=in=(RNA,DNA))'

      expect(actual).to.equal(expected)
    })

    it('should create a query with only a standards filter', () => {
      state.standards.filters.push('cen-ts-16826-1-2015')

      const actual = helpers.createRSQLQuery(state)
      const expected = '&q=(standards=in=(cen-ts-16826-1-2015))'

      expect(actual).to.equal(expected)
    })

    it('should create a query with only a disease type filter', () => {
      state.diagnosis_available.filters.push(
        {id: 'urn:miriam:id:disease-1', code: 'C01', label: 'small disease'},
        {id: 'urn:miriam:id:disease-2', code: 'C02', label: 'medium disease'},
        {id: 'urn:miriam:id:disease-3', code: 'C03', label: 'big disease'}
      )

      const actual = helpers.createRSQLQuery(state)
      const expected = '&q=(diagnosis_available=in=(urn:miriam:id:disease-1,urn:miriam:id:disease-2,urn:miriam:id:disease-3))'

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
      const expected = '&q=*=q=test search'

      expect(actual).to.equal(expected)
    })

    it('should create a query with filters and a search', () => {
      state.country.filters.push('NL', 'BE')
      state.search = 'test search'

      const actual = helpers.createRSQLQuery(state)
      const expected = '&q=(country=in=(NL,BE));*=q=test search'

      expect(actual).to.equal(expected)
    })
  })

  describe('createNegotiatorQueryBody', () => {
    it('should generate a javascript object containing URL, collections, human readable, and an nToken', () => {
      const state = {
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
        ],
        search: 'free text search',
        country: {
          filters: ['NL', 'BE']
        },
        materials: {
          filters: ['RNA']
        },
        standards: {
          filters: ['cen-ts-16826-1-2015']
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

      const actual = helpers.createNegotiatorQueryBody(state, 'http://test.com?id=1&nToken=2837538B50189SR237489X14098A2374')
      const expected = {
        URL: 'http://test.com?id=1',
        collections: [
          {biobankId: 'biobank-1', collectionId: 'collection-1'},
          {biobankId: 'biobank-1', collectionId: 'collection-2'},
          {biobankId: 'biobank-2', collectionId: 'collection-3'},
          {biobankId: 'biobank-2', collectionId: 'collection-4'}
        ],
        humanReadable: 'Free text search contains free text search and selected countries are NL,BE and selected material types are RNA and selected standards are cen-ts-16826-1-2015 and selected disease types are small disease,medium disease,big disease',
        nToken: state.nToken
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

    it('should generate a human readable string with only a standards filter', () => {
      state.standards.filters.push('cen-ts-16826-1-2015')

      const actual = helpers.getHumanReadableString(state)
      const expected = 'selected standards are cen-ts-16826-1-2015'

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
      state.standards.filters.push('cen-ts-16826-1-2015')
      state.diagnosis_available.filters.push(
        {id: '1', label: 'small disease'},
        {id: '2', label: 'big disease'}
      )

      const actual = helpers.getHumanReadableString(state)
      const expected = 'Free text search contains this is a free text search and selected countries are NL,BE and selected material types are PLASMA,RNA and selected standards are cen-ts-16826-1-2015 and selected disease types are small disease,big disease'

      expect(actual).to.equal(expected)
    })
  })
})
