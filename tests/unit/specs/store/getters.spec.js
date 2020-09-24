
import getters from '../../../../src/store/getters'
import { mockState } from '../mockState'

let state

describe('store', () => {
  beforeEach(() => {
    state = mockState()
  })

  describe('getters', () => {
    describe('rsql', () => {
      it('should transform the collection filters to rsql', () => {
        state.search = 'Cell&Co'
        state.country.filters = ['AT', 'BE']
        state.covid19.filters = ['covid19']

        expect(getters.rsql(state)).toEqual('country=in=(AT,BE);(name=q=Cell&Co,id=q=Cell&Co,acronym=q=Cell&Co,biobank.name=q=Cell&Co,biobank.id=q=Cell&Co,biobank.acronym=q=Cell&Co)')
      })
      it('should return the empty string if no filters are selected', () => {
        expect(getters.rsql(state)).toEqual('')
      })
      it('should include the default country code if showCountryFacet is set to false', () => {
        state.preConfiguredCountyCode = 'BE'
        state.showCountryFacet = false
        expect(getters.rsql(state)).toEqual('country=in=BE')
      })
    })
    describe('biobankRsql', () => {
      it('should transform the biobank filters to rsql', () => {
        state.country.filters = ['AT', 'BE']
        state.covid19.filters = ['covid19']

        expect(getters.biobankRsql(state)).toEqual('country=in=(AT,BE);covid19biobank==covid19')
      })
      it('should create AND filter for covid19 biobank filter values', () => {
        state.search = 'Cell&Co'
        state.covid19.filters = ['covid19', 'covid19a']

        expect(getters.biobankRsql(state)).toEqual('covid19biobank==covid19;covid19biobank==covid19a')
      })
      it('should return an empty string if no filters are selected', () => {
        expect(getters.biobankRsql(state)).toEqual('')
      })
      it('should include the default country code if showCountryFacet is set to false', () => {
        state.showCountryFacet = false
        state.preConfiguredCountyCode = 'BE'

        expect(getters.biobankRsql(state)).toEqual('country=in=BE')
      })
    })
    describe('biobanks', () => {
      it('should return empty list when loading', () => {
        state = {}
        expect(getters.biobanks(state, { loading: true })).toStrictEqual([])
      })
      it('should look up the biobanks for matching collection ids and filter the biobank\'s collections', () => {
        state.biobanks = {
          1: { id: '1', name: 'one', collections: [{ id: 'col-1', sub_collections: [] }] },
          2: { id: '2', name: 'two', collections: [{ id: 'col-2', sub_collections: [] }, { id: 'col-3', sub_collections: [] }] }
        }
        state.biobankIds = ['1', '2']
        state.collectionIds = [{ collectionId: 'col-2', biobankId: '2' }]
        const otherGetters = { loading: false, rsql: 'type=in=(type1)' }
        expect(getters.biobanks(state, otherGetters)).toStrictEqual([{ id: '2', name: 'two', collections: [{ id: 'col-2', sub_collections: [] }] }])
      })
      it('should return all biobanks if the collections are not filtered', () => {
        state.biobanks = {
          2: { id: '2', name: 'two', collections: [{ id: 'col-2', sub_collections: [] }] }
        }
        state.biobankIds = ['1', '2']
        state.collectionIds = [{ collectionId: 'col-2', biobankId: '2' }]

        const otherGetters = { loading: false, rsql: '' }
        expect(getters.biobanks(state, otherGetters)).toStrictEqual([
          '1',
          { id: '2', name: 'two', collections: [{ id: 'col-2', sub_collections: [] }] }
        ])
      })
      it('should not filter out collections with matching subcollections',
        () => {
          const biobank1 = {
            id: '1',
            name: 'one',
            collections: [{ id: 'col-1', sub_collections: [] }]
          }
          const biobank2 = {
            id: '2',
            name: 'two',
            collections: [
              { id: 'col-2', sub_collections: [] },
              { id: 'col-3', sub_collections: [{ id: 'col-4', sub_collections: [] }] }]
          }
          const state = {
            biobanks: { 1: biobank1, 2: biobank2 },
            biobankIds: ['1', '2'],
            collectionIds: [{ collectionId: 'col-4', biobankId: '2' }]
          }
          const otherGetters = { loading: false, rsql: 'type=in=(type1)' }
          expect(getters.biobanks(state, otherGetters)).toStrictEqual([{
            id: '2',
            name: 'two',
            collections: [{ id: 'col-3', sub_collections: [{ id: 'col-4', sub_collections: [] }] }]
          }])
        })

      it('should return the biobanks in the order they appear in collectionIds', () => {
        const state = {
          biobanks: {
            1: { id: '1', name: 'B', collections: [{ id: 'col-1', sub_collections: [] }] },
            2: { id: '2', name: 'A', collections: [{ id: 'col-2', sub_collections: [] }] }
          },
          biobankIds: ['1', '2'],
          collectionIds: [
            { collectionId: 'col-1', biobankId: '2' },
            { collectionId: 'col-2', biobankId: '1' }
          ]
        }
        const otherGetters = { loading: false, rsql: 'type=in=(type1)' }
        expect(getters.biobanks(state, otherGetters)).toStrictEqual([
          { id: '2', name: 'A', collections: [{ id: 'col-2', sub_collections: [] }] },
          { id: '1', name: 'B', collections: [{ id: 'col-1', sub_collections: [] }] }
        ])
      })
    })

    it('should return the total amount of collections for found biobanks', () => {
      const getFoundBiobankIds = ['B']
      const getCollectionsWithBiobankId = [{ collectionId: 'A', biobankId: 'B' }, { collectionId: 'C', biobankId: 'B' }, { collectionId: 'D', biobankId: 'E' }]
      const otherGetters = { getFoundBiobankIds, getCollectionsWithBiobankId }
      expect(getters.foundCollections(state, otherGetters)).toEqual(2)
    })

    it('should return an array of biobank Ids', () => {
      const biobanks = [
        { id: '1', name: 'Biobank 1', collections: [{ id: 'col-1', sub_collections: [] }] },
        { id: '2', name: 'Biobank 2', collections: [{ id: 'col-2', sub_collections: [] }] },
        { id: '3', name: 'Biobank 3', collections: [{ id: 'col-3', sub_collections: [] }, { id: 'col-4', sub_collections: [] }] }
      ]

      const otherGetters = { biobanks }
      expect(getters.getFoundBiobankIds(state, otherGetters)).toStrictEqual(['1', '2', '3'])
    })
    it('should return an array of biobank Ids when only ids are present', () => {
      const biobanks = ['1', '2', '3']

      const otherGetters = { biobanks }
      expect(getters.getFoundBiobankIds(state, otherGetters)).toStrictEqual(['1', '2', '3'])
    })

    describe('loading', () => {
      it('should be false if both biobankIds and collectionIds are present', () => {
        const state = {
          biobankIds: ['biobank1'],
          collectionIds: [{ collectionId: 'col-2', biobankId: 'biobank1' }]
        }
        expect(getters.loading(state)).toBe(false)
      })

      it('should be true if biobankIds are missing', () => {
        const state = {
          biobankIds: undefined,
          collectionIds: [{ collectionId: 'col-2', biobankId: 'biobank1' }]
        }
        expect(getters.loading(state)).toBe(true)
      })

      it('should be true if collectionIds are missing', () => {
        const state = {
          biobankIds: ['biobank1'],
          collectionIds: undefined
        }
        expect(getters.loading(state)).toBe(true)
      })
    })

    describe('getTypesOptions', () => {
      it('should retrieve the type options', () => {
        const state = { type: { options: [{ id: 'id', label: 'label' }] } }
        expect(state.type.options).toStrictEqual(getters.getTypesOptions(state))
      })
    })

    describe('getDataTypeOptions', () => {
      it('should retrieve the type options', () => {
        const state = { dataType: { options: [{ id: 'id', label: 'label' }] } }
        expect(state.dataType.options).toStrictEqual(getters.getDataTypeOptions(state))
      })
    })

    describe('getCountryOptions', () => {
      it('should retrieve the options that are available for the country filter', () => {
        const expected = ['AT', 'BE']
        state.country.options = expected
        const actual = getters.getCountryOptions(state)

        expect(actual).toStrictEqual(expected)
      })
    })

    describe('getMaterialOptions', () => {
      it('should retrieve the options that are available for the material type filter', () => {
        const expected = ['RNA', 'DNA']
        const state = {
          materials: {
            options: expected
          }
        }

        const actual = getters.getMaterialOptions(state)

        expect(actual).toStrictEqual(expected)
      })
    })

    describe('getCollectionQualityOptions', () => {
      it('should retrieve the options that are available for the collection standards filter', () => {
        const expected = ['self', 'eric']
        const state = {
          collection_quality: {
            options: expected
          }
        }
        const actual = getters.getCollectionQualityOptions(state)

        expect(actual).toStrictEqual(expected)
      })
    })

    describe('getBiobankQualityOptions', () => {
      it('should retrieve the options that are available for the biobank standards filter', () => {
        const expected = ['accredited', 'eric']
        const state = {
          biobank_quality: {
            options: expected
          }
        }
        const actual = getters.getBiobankQualityOptions(state)

        expect(actual).toStrictEqual(expected)
      })
    })

    describe('getDiagnosisAvailableOptions', () => {
      it('should retrieve the options that are available for the disease type filter', () => {
        const expected = [
          { id: '1', label: 'small disease' },
          { id: '2', label: 'big disease' }
        ]
        const state = {
          diagnosis_available: {
            options: expected
          }
        }
        const actual = getters.getDiagnosisAvailableOptions(state)

        expect(actual).toStrictEqual(expected)
      })
    })

    describe('getCovid19Options', () => {
      it('should retrieve the options that are available for the covid19 filter', () => {
        const expected = [
          { id: 'covid19', label: 'Member of the COVID-19 network' }
        ]
        const state = {
          covid19: {
            options: expected
          }
        }
        const actual = getters.getCovid19Options(state)

        expect(actual).toStrictEqual(expected)
      })
    })

    describe('getCovid19NetworkOptions', () => {
      it('should retrieve the options that are available for the covid19network filter', () => {
        const actual = getters.getCovid19NetworkOptions(state)
        const expected = mockState().covid19network.options

        expect(actual).toStrictEqual(expected)
      })
    })

    describe('getBiobankNetworkOptions', () => {
      it('should retrieve the options that are available for the BiobankNetwork filter', () => {
        const expected = [
          { test: 'getBiobankNetworkOptions' }
        ]
        const state = {
          biobank_network: {
            options: expected
          }
        }
        const actual = getters.getBiobankNetworkOptions(state)

        expect(actual).toStrictEqual(expected)
      })
    })

    describe('getCollectionNetworkOptions', () => {
      it('should retrieve the options that are available for the CollectionNetwork filter', () => {
        const expected = [
          { test: 'getCollectionNetworkOptions' }
        ]
        const state = {
          collection_network: {
            options: expected
          }
        }
        const actual = getters.getCollectionNetworkOptions(state)

        expect(actual).toStrictEqual(expected)
      })
    })

    describe('getActiveFilters', () => {
      it('should retrieve an object of filter name <-> filters', () => {
        state.search = 'test searchterm'

        state.country = {
          filters: ['AT'],
          options: [{ id: 'AT', name: 'Austria' }]
        }
        state.materials = {
          filters: ['PLASMA'],
          options: [{ id: 'PLASMA', label: 'Plasma' }]
        }
        state.collection_quality = {
          filters: ['eric'],
          options: [{
            id: 'eric',
            label: 'BBMRI-ERIC audited'
          }, {
            id: 'self',
            label: 'Self assessment (BBMRI-ERIC remote audited)'
          }, {
            id: 'self_dev',
            label: 'Self assessment (BBMRI-ERIC remote audited) with documented deviations'
          }]
        }
        state.biobank_quality = {
          filters: ['eric'],
          options: [{
            id: 'eric',
            label: 'BBMRI-ERIC audited'
          }, {
            id: 'accredited',
            label: 'Certified by accredited body'
          }]
        }
        state.type = {
          filters: ['BIRTH_COHORT', 'CASE_CONTROL'],
          options: [
            { id: 'BIRTH_COHORT', label: 'Birth cohort' },
            { id: 'CASE_CONTROL', label: 'Case control' }
          ]
        }
        state.covid19 = {
          filters: ['covid19'],
          options: [{ id: 'covid19', label: 'Member of the COVID-19 network' }]
        }
        state.dataType = {
          filters: ['BIOLOGICAL_SAMPLES', 'GENEALOGICAL_RECORDS'],
          options: [
            { id: 'BIOLOGICAL_SAMPLES', label: 'Biological samples' },
            { id: 'GENEALOGICAL_RECORDS', label: 'Genealogical records' }
          ]
        }

        const actual = getters.getActiveFilters(state)
        const expected = {
          materials: [
            { id: 'PLASMA', label: 'Plasma' }
          ],
          country: [
            { id: 'AT', label: 'Austria' }
          ],
          type: [
            { id: 'BIRTH_COHORT', label: 'Birth cohort' },
            { id: 'CASE_CONTROL', label: 'Case control' }
          ],
          covid19: [
            {
              id: 'covid19',
              label: 'Member of the COVID-19 network'
            }
          ],
          dataType: [
            { id: 'BIOLOGICAL_SAMPLES', label: 'Biological samples' },
            { id: 'GENEALOGICAL_RECORDS', label: 'Genealogical records' }
          ],
          collection_quality: [{
            id: 'eric',
            label: 'BBMRI-ERIC audited'
          }],
          biobank_quality: [{
            id: 'eric',
            label: 'BBMRI-ERIC audited'
          }],
          search: [{ id: 'search', label: state.search }]
        }

        expect(actual).toStrictEqual(expected)
      })

      it('should retrieve an object of filters with diagnosis_available in it', () => {
        const expected = {
          diagnosis_available: [
            {
              _href: '/api/v2/eu_bbmri_eric_disease_types/urn:miriam:icd:C00-C97',
              id: 'urn:miriam:icd:C00-C97',
              code: 'C00-C97',
              label: 'C00-C97 - Malignant neoplasms',
              ontology: 'ICD-10'
            }
          ]
        }
        state.diagnosis_available.filters = expected.diagnosis_available
        const actual = getters.getActiveFilters(state)
        expect(actual).toStrictEqual(expected)
      })
    })

    describe('showCountryFacet', () => {
      it('should return true if showCountryFacet setting is set to true', () => {
        const state = { showCountryFacet: true }
        expect(getters.showCountryFacet(state)).toEqual(true)
      })
      it('should return false if showCountryFacet setting is set to false', () => {
        const state = { showCountryFacet: false }
        expect(getters.showCountryFacet(state)).toEqual(false)
      })
    })

    describe('getErrorMessage', () => {
      it('should return undefined if no error is set', () => {
        const state = { error: undefined }
        expect(getters.getErrorMessage(state)).toEqual(undefined)
      })
      it('should return message of first error', () => {
        const state = { error: { errors: [{ message: 'this is the first error' }] } }
        expect(getters.getErrorMessage(state)).toEqual('this is the first error')
      })
      it('should return message of first error', () => {
        const state = { error: new Error('Beautiful message') }
        expect(getters.getErrorMessage(state)).toEqual('Beautiful message')
      })
      it('should return that something went wrong', () => {
        const state = { error: {} }
        expect(getters.getErrorMessage(state)).toEqual('Something went wrong')
      })
    })
  })
})
