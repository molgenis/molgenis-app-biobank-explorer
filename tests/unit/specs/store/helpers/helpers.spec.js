
import { createFilters } from '../../../../../src/config/facetConfigurator'
import helpers, {
  filterCollectionTree,
  isCodeRegex
} from '../../../../../src/store/helpers'
import { mockState } from '../../mockData'

let state

describe('store', () => {
  beforeEach(() => {
    state = mockState()
  })
  describe('Vuex store helper functions', () => {
    describe('filterCollectionTree', () => {
      it('should filter collections with matching IDs', () => {
        const collections = [
          { id: 1, sub_collections: [] },
          { id: 2, sub_collections: [] },
          { id: 3, sub_collections: [] },
          { id: 4, sub_collections: [] },
          { id: 5, sub_collections: [] }
        ]
        const expected = [
          { id: 2, sub_collections: [] },
          { id: 4, sub_collections: [] }
        ]
        expect(filterCollectionTree([2, 4], collections)).toStrictEqual(expected)
      })
      it('should filter subcollections', () => {
        expect(filterCollectionTree([2, 4], [{
          id: 1,
          sub_collections: [
            { id: 2, sub_collections: [] },
            { id: 3, sub_collections: [] },
            { id: 4, sub_collections: [] },
            { id: 5, sub_collections: [] }
          ]
        }])).toStrictEqual([{
          id: 1,
          sub_collections: [
            { id: 2, sub_collections: [] },
            { id: 4, sub_collections: [] }
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
        }])).toStrictEqual([{
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
        expect(isCodeRegex.test('A')).toEqual(true)
      })

      it('should be case-insensitive', () => {
        expect(isCodeRegex.flags).toEqual('i')
      })

      it('should match chapter code', () => {
        expect(isCodeRegex.test('A10-A12')).toEqual(true)
      })

      it('should match top level chapter code', () => {
        expect(isCodeRegex.test('XIX')).toEqual(true)
      })

      it('should match disease code', () => {
        expect(isCodeRegex.test('A10.001')).toEqual(true)
      })

      it('should not match other query string', () => {
        expect(isCodeRegex.test('he')).toEqual(false)
      })
    })

    describe('createRSQLQuery', () => {
      beforeEach(() => { state = { ...mockState(), filterFacets: createFilters(mockState()) } })

      it('should create a query with only a country filter', () => {
        state.filters.selections.country = ['NL', 'BE']

        const actual = helpers.createRSQLQuery(state)
        const expected = 'country=in=(NL,BE)'

        expect(actual).toBe(expected)
      })

      it('should create a query with only a materials filter', () => {
        state.filters.selections.materials = ['RNA', 'DNA']

        const actual = helpers.createRSQLQuery(state)
        const expected = 'materials=in=(RNA,DNA)'

        expect(actual).toBe(expected)
      })

      it('should create a query with only a disease type filter', () => {
        state.filters.selections.diagnosis_available = ['id:G71', 'id:ORPHA:10', 'id:ORPHA:100']

        const actual = helpers.createRSQLQuery(state)
        const expected = 'diagnosis_available=in=(id:G71,id:ORPHA:10,id:ORPHA:100)'

        expect(actual).toBe(expected)
      })

      it('should create a query with only a network type filter', () => {
        state.filters.selections.network = ['network_1', 'network_2', 'network_3']

        const actual = helpers.createRSQLQuery(state)
        const expected = 'combined_network=in=(network_1,network_2,network_3)'

        expect(actual).toBe(expected)
      })

      it('should create a query with no filters and no search', () => {
        const actual = helpers.createRSQLQuery(state)
        const expected = ''

        expect(actual).toBe(expected)
      })

      it('should create a query with only a search', () => {
        state.filters.selections.search = 'test search'

        const actual = helpers.createRSQLQuery(state)
        const expected = 'name=like=\'test search\',id=like=\'test search\',acronym=like=\'test search\',diagnosis_available.id=like=\'test search\',diagnosis_available.code=like=\'test search\',diagnosis_available.label=like=\'test search\',diagnosis_available.ontology=like=\'test search\',materials.id=like=\'test search\',materials.label=like=\'test search\',biobank.name=like=\'test search\',biobank.id=like=\'test search\',biobank.acronym=like=\'test search\''

        expect(actual).toBe(expected)
      })

      it('should create a query with filters and a search', () => {
        state.filters.selections.country = ['NL', 'BE']
        state.filters.selections.search = 'test search'

        const actual = helpers.createRSQLQuery(state)
        const expected = '(name=like=\'test search\',id=like=\'test search\',acronym=like=\'test search\',diagnosis_available.id=like=\'test search\',diagnosis_available.code=like=\'test search\',diagnosis_available.label=like=\'test search\',diagnosis_available.ontology=like=\'test search\',materials.id=like=\'test search\',materials.label=like=\'test search\',biobank.name=like=\'test search\',biobank.id=like=\'test search\',biobank.acronym=like=\'test search\');country=in=(NL,BE)'

        expect(actual).toBe(expected)
      })

      it('should create a query with disease type filter enabling satisfy all and a country, not supporting it', () => {
        state.filters.selections.diagnosis_available = ['id:G71', 'id:ORPHA:10', 'id:ORPHA:100']
        state.filters.satisfyAll = ['diagnosis_available']
        state.filters.selections.country = ['NL', 'BE']

        const actual = helpers.createRSQLQuery(state)
        const expected = 'diagnosis_available==id:G71;diagnosis_available==id:ORPHA:10;diagnosis_available==id:ORPHA:100;country=in=(NL,BE)'

        expect(actual).toBe(expected)
      })

      it('should create a query with materials and type, the first with the satisfyAll flag enabled and the second not', () => {
        state.filters.selections.materials = ['cDNA', 'mRNA', 'Cells']
        state.filters.satisfyAll = ['materials']
        state.filters.selections.type = ['Cohort', 'Longitudinal']

        const actual = helpers.createRSQLQuery(state)
        const expected = 'type=in=(Cohort,Longitudinal);materials==cDNA;materials==mRNA;materials==Cells'

        expect(actual).toBe(expected)
      })

      it('should create a query with network and collection_network, the first with the satisfyAll flag enabled and the second not', () => {
        state.filters.selections.network = ['network_1', 'network_2', 'network_3']
        state.filters.satisfyAll = ['network']

        const actual = helpers.createRSQLQuery(state)
        const expected = 'combined_network==network_1;combined_network==network_2;combined_network==network_3'

        expect(actual).toBe(expected)
      })
    })

    describe('createBiobankRSQLQuery', () => {
      afterEach(() => { state = mockState() })
      it('should create a Biobank query with a capabilities filter and the satisfy all flag enabled', () => {
        state.filters.selections.biobank_capabilities = ['covid_1', 'covid_2']
        state.filters.satisfyAll = ['biobank_capabilities']

        const actual = helpers.createBiobankRSQLQuery(state)
        const expected = 'capabilities==covid_1;capabilities==covid_2'

        expect(actual).toBe(expected)
      })

      it('should create a Biobank query with a covid19 filter and country filter. For country, satisfyAll is not supported', () => {
        state.filters.selections.biobank_capabilities = ['covid_1', 'covid_2']
        state.filters.satisfyAll = ['biobank_capabilities']
        state.filters.selections.country = ['NL', 'BE']

        const actual = helpers.createBiobankRSQLQuery(state)
        const expected = 'country=in=(NL,BE);capabilities==covid_1;capabilities==covid_2'

        expect(actual).toBe(expected)
      })
    })

    describe('createNegotiatorQueryBody', () => {
      it('should generate a negotiator query with collection and biobank filter expressions', () => {
        state.negotiatorCollectionEntityId = 'eu_bbmri_eric_collections'
        state.nToken = '2837538B50189SR237489X14098A2374'

        state.searchHistory = ['Text search is free text search and Countries: Netherlands, Belgium and Material type(s): RNA and Collection quality mark(s): eric and Collection type(s): type and Data type(s): dataType and Disease type(s): small disease, medium disease, big disease and Covid-19 service(s): covid19 and with custom collection selection.']

        const getters = {
          selectedCollections: [{ label: 'Collection A', value: 'collection1' }, { text: 'Collection B', value: 'collection4' }]
        }

        const actual = helpers.createNegotiatorQueryBody(state, getters, 'http://test.com?id=1&nToken=2837538B50189SR237489X14098A2374')
        const expected = {
          URL: 'http://test.com?id=1',
          humanReadable: '#1: Text search is free text search and Countries: Netherlands, Belgium and Material type(s): RNA and Collection quality mark(s): eric and Collection type(s): type and Data type(s): dataType and Disease type(s): small disease, medium disease, big disease and Covid-19 service(s): covid19 and with custom collection selection.',
          nToken: state.nToken,
          entityId: 'eu_bbmri_eric_collections',
          rsql: 'id=in=(collection1,collection4)'
        }

        expect(actual).toStrictEqual(expected)
      })

      it('should generate a negotiator query with collection filter expressions', () => {
        state.negotiatorCollectionEntityId = 'eu_bbmri_eric_collections'
        state.nToken = '2837538B50189SR237489X14098A2374'
        state.searchHistory = ['Material type(s): RNA and with custom collection selection.']

        const getters = {
          selectedCollections: [{ label: 'Collection A', value: 'collection1' }, { text: 'Collection B', value: 'collection4' }]
        }

        const actual = helpers.createNegotiatorQueryBody(state, getters, 'http://test.com?id=1&nToken=2837538B50189SR237489X14098A2374')
        const expected = {
          URL: 'http://test.com?id=1',
          humanReadable: '#1: Material type(s): RNA and with custom collection selection.',
          nToken: state.nToken,
          entityId: 'eu_bbmri_eric_collections',
          rsql: 'id=in=(collection1,collection4)'
        }
        expect(actual).toStrictEqual(expected)
      })
    })

    describe('getHumanReadableString', () => {
      let state
      let getters

      beforeEach(() => {
        state = mockState()
        state.filters.labels = { materials: ['PLASMA', ' RNA'] }
        state.filters.selections.search = ['this is a free text search']
        state.filters.selections.materials = ['PLASMA', 'RNA']
        getters = {
          activeFilters: () => state.filters.selections,
          selectedCollections: [{ label: 'Collection A', value: 'collection1' }, { text: 'Collection B', value: 'collection4' }]
        }
      })

      it('should generate a human readable string based on the filters', async () => {
        const actual = helpers.getHumanReadableString(state, getters)
        const expected = 'Text search is this is a free text search and Material type(s): PLASMA,  RNA'

        expect(actual).toBe(expected)
      })
    })
  })
})
