import mutations from '../../../../src/store/mutations'
import { mockState } from '../mockState'
import { covid19CollectionNetworkSelectionId, covid19NetworkId, covid19BiobankNetworkSelectionId } from '../../../../src/store/helpers/covid19Helper'

let state

describe('store', () => {
  beforeEach(() => {
    state = mockState()
  })
  describe('mutations', () => {
    describe('SetCovid19', () => {
      it('should set the COVID19 options in the state with the payload', () => {
        const covidOptionsLabel = [{ id: 'covid19', label: 'member of covid 19 network' }]
        mutations.SetCovid19(state, covidOptionsLabel)

        expect(state.covid19.options).toStrictEqual(covidOptionsLabel)
      })
    })

    describe('SetNetworkOptions', () => {
      it('should set the network options for biobank and collections without covid19', () => {
        const testCase = [{ id: 'test_network', label: 'My awesome test network' }]
        const covidOptionsLabel = [{ id: covid19NetworkId, name: 'member of covid 19 network' }, testCase[0]]
        mutations.SetNetworkOptions(state, covidOptionsLabel)

        expect(state.biobank_network.options).toStrictEqual(testCase)
        expect(state.collection_network.options).toStrictEqual(testCase)
      })
    })

    describe('SetDiagnosisAvailable', () => {
      it('should set the diagnosis available in the state with the payload', () => {
        const payload = [{
          code: 'C22.3',
          label: 'Angiosarcoma of liver'
        }]
        mutations.SetDiagnosisAvailable(state, payload)

        const expected = [
          {
            code: 'C22.3',
            label: 'C22.3 - Angiosarcoma of liver',
            originalLabel: 'Angiosarcoma of liver'
          }
        ]
        expect(state.diagnosis_available.options).toStrictEqual(expected)
      })
    })

    describe('UpdateFilter', () => {
      it('should update the list of filters for a specific state key', () => {
        const countries = ['NL', 'BE']
        mutations.UpdateFilter(state, { name: 'country', filters: countries })

        expect(state.country.filters).toStrictEqual(countries)
      })

      it('should only set covid19networkId to biobank_network filter when covid19network biobank checkbox has been selected', () => {
        mutations.SetCovid19Network(state, [covid19BiobankNetworkSelectionId])
        expect(state.biobank_network.filters).toStrictEqual([covid19NetworkId])
        expect(state.collection_network.filters).toStrictEqual([])
      })

      it('should only set covid19networkId to collection_network filter when covid19network collection checkbox has been selected', () => {
        mutations.SetCovid19Network(state, [covid19CollectionNetworkSelectionId])
        expect(state.collection_network.filters).toStrictEqual([covid19NetworkId])
        expect(state.biobank_network.filters).toStrictEqual([])
      })

      it('should clear biobank covid19network id if not selected', () => {
        state.biobank_network.filters = ['networkA', covid19NetworkId, 'networkB']
        state.collection_network.filters = [covid19NetworkId]
        mutations.SetCovid19Network(state, [covid19CollectionNetworkSelectionId])
        expect(state.biobank_network.filters).toStrictEqual(['networkA', 'networkB'])
      })

      it('should only set the covid19 network id once, even if already present', () => {
        state.collection_network.filters = [covid19NetworkId]
        mutations.SetCovid19Network(state, [covid19CollectionNetworkSelectionId])
        expect(state.collection_network.filters).toStrictEqual([covid19NetworkId])
      })
    })

    describe('ResetFilters', () => {
      it('should reset all the filters in the state', () => {
        state.country = {
          filters: ['AT'],
          options: [{ id: 'AT', name: 'Austria' }]
        }
        state.materials = {
          filters: ['PLASMA'],
          options: [{ id: 'PLASMA', label: 'Plasma' }]
        }
        state.diagnosis_available.filters = ['C18']
        state.collection_quality.filters = ['Awesome standard']
        state.biobank_quality.filters = ['Awesome standard']

        state.type = {
          filters: ['type'],
          options: [{ id: 'type' }]
        }
        state.covid19 = {
          filters: ['covid19'],
          options: [{ id: 'covid19' }]
        }
        state.dataType = {
          filters: ['type'],
          options: [{ id: 'type' }]
        }

        mutations.ResetFilters(state)
        const expected = mockState()
        expected.country.options = [{ id: 'AT', name: 'Austria' }]
        expected.materials.options = [{ id: 'PLASMA', label: 'Plasma' }]
        expected.type.options = [{ id: 'type' }]
        expected.covid19.options = [{ id: 'covid19' }]
        expected.dataType.options = [{ id: 'type' }]

        expect(state.country).toStrictEqual(expected.country)
        expect(state.materials).toStrictEqual(expected.materials)
        expect(state.diagnosis_available).toStrictEqual(expected.diagnosis_available)
        expect(state.collection_quality).toStrictEqual(expected.collection_quality)
      })
    })

    describe('SetBiobanks', () => {
      it('should add the biobanks to the store', () => {
        const biobank1 = { id: 'biobank1', collections: [] }
        const biobank2 = { id: 'biobank2', collections: [] }
        state.biobanks = {
          biobank1
        }

        const biobanks = [biobank2]

        mutations.SetBiobanks(state, biobanks)

        expect(state.biobanks).toStrictEqual({ biobank1, biobank2 })
      })
      it('should reconstruct the collections tree', () => {
        const biobanks = [{
          id: 'biobank1',
          collections: [
            { id: 1, sub_collections: [{ id: 2 }] },
            { id: 2, parent: 1, sub_collections: [{ id: 3 }] },
            { id: 3, parent: 2, sub_collections: [{ id: 4 }] },
            { id: 4, parent: 3, sub_collections: [] }]
        }]
        const expected = {
          id: 'biobank1',
          collections: [
            {
              id: 1,
              sub_collections: [{
                id: 2,
                parent: 1,
                sub_collections: [{
                  id: 3,
                  parent: 2,
                  sub_collections: [{
                    id: 4,
                    parent: 3,
                    sub_collections: []
                  }]
                }]
              }]
            }]
        }
        mutations.SetBiobanks(state, biobanks)

        expect(state.biobanks.biobank1).toStrictEqual(expected)
      })
    })

    describe('SetError', () => {
      it('should set the error in the state with the payload', () => {
        const error = 'error'
        mutations.SetError(state, error)

        expect(state.error).toBe(error)
      })
    })

    describe('SetSearch', () => {
      it('should set the search query in the state with the payload', () => {
        const search = 'this is a search'
        mutations.SetSearch(state, search)

        expect(state.search).toBe(search)
      })
    })

    describe('MapQueryToState', () => {
      it('should map everything from router query to state without diagnoses', () => {
        state.route = {
          query: {
            country: 'NL,BE',
            materials: 'RNA,PLASMA',
            collection_quality: 'eric,self',
            search: 'search',
            type: 'BIRTH_COHORT',
            dataType: 'BIOLOGICAL_SAMPLES',
            nToken: '29djgCm29104958f7dLqopf92JDJKS',
            biobank_network: 'networkA,networkB',
            biobank_quality: 'qualityA',
            collection_network: 'networkC,networkD',
            covid19: 'covid19'
          }
        }

        mutations.MapQueryToState(state)

        expect(state.country.filters).toStrictEqual(['NL', 'BE'])
        expect(state.materials.filters).toStrictEqual(['RNA', 'PLASMA'])
        expect(state.type.filters).toStrictEqual(['BIRTH_COHORT'])
        expect(state.covid19.filters).toStrictEqual(['covid19'])
        expect(state.dataType.filters).toStrictEqual(['BIOLOGICAL_SAMPLES'])
        expect(state.collection_quality.filters).toStrictEqual(['eric', 'self'])
        expect(state.covid19.filters).toStrictEqual(['covid19'])
        expect(state.biobank_network.filters).toStrictEqual(['networkA', 'networkB'])
        expect(state.biobank_quality.filters).toStrictEqual(['qualityA'])
        expect(state.search).toBe('search')
        expect(state.nToken).toBe('29djgCm29104958f7dLqopf92JDJKS')
      })

      it('should map everything from router query to state with diagnoses', () => {
        state.route = {
          query: {
            country: 'NL,BE',
            materials: 'RNA,PLASMA',
            collection_quality: 'eric,self',
            search: 'search',
            nToken: '29djgCm29104958f7dLqopf92JDJKS'
          }
        }

        const payload = [{
          code: 'C22.3',
          label: 'Angiosarcoma of liver'
        }]
        mutations.MapQueryToState(state, { diagnoses: payload })

        const expected = [
          {
            code: 'C22.3',
            label: 'C22.3 - Angiosarcoma of liver',
            originalLabel: 'Angiosarcoma of liver'
          }
        ]

        expect(state.country.filters).toStrictEqual(['NL', 'BE'])
        expect(state.materials.filters).toStrictEqual(['RNA', 'PLASMA'])
        expect(state.collection_quality.filters).toStrictEqual(['eric', 'self'])
        expect(state.diagnosis_available.filters).toStrictEqual(expected)
        expect(state.search).toBe('search')
        expect(state.nToken).toBe('29djgCm29104958f7dLqopf92JDJKS')
      })
    })

    describe('SetBiobankQualityBiobanks', () => {
      it('should set the biobanks that match the applied quality standards filter', () => {
        const payload = {
          items: [
            {
              biobank: { id: 'biobank-1' },
              quality_standard: { id: 'iso-15189', label: 'ISO 15189:2012' },
              assess_level_col: { id: 'eric', label: 'BBMRI-ERIC audited' }
            },
            {
              biobank: { id: 'biobank-1' },
              quality_standard: { id: 'iso-17043-2010', label: 'ISO 17043:2010' },
              assess_level_col: { id: 'accredited', label: 'Certified by accredited body' }
            },
            {
              biobank: { id: 'biobank-2' },
              quality_standard: { id: 'iso-17043-2010', label: 'ISO 17043:2010' },
              assess_level_col: { id: 'eric', label: 'BBMRI-ERIC audited' }
            }
          ]
        }

        const expected = ['biobank-1', 'biobank-2']

        mutations.SetBiobankIdsWithSelectedQuality(state, payload)

        expect(state.biobankIdsWithSelectedQuality).toStrictEqual(expected)
      })

      it('should set an invalid biobank id when the filter applied on the biobank quality standards returns no matching biobanks', () => {
        state.filters.selections.biobank_quality = ['eric']
        const payload = {}
        const expected = ['no-biobank-found']

        mutations.SetBiobankIdsWithSelectedQuality(state, payload)

        expect(state.biobankIdsWithSelectedQuality).toStrictEqual(expected)
      })
    })

    describe('SetCollectionQualityCollections', () => {
      it('should set the cols that match the applied quality standards filter', () => {
        const payload = [
          {
            collection: { id: 'col-1' },
            quality_standard: { id: 'iso-15189', label: 'ISO 15189:2012' },
            assess_level_col: { id: 'eric', label: 'BBMRI-ERIC audited' }
          },
          {
            collection: { id: 'col-1' },
            quality_standard: { id: 'iso-17043-2010', label: 'ISO 17043:2010' },
            assess_level_col: { id: 'accredited', label: 'Certified by accredited body' }
          },
          {
            collection: { id: 'col-2' },
            quality_standard: { id: 'iso-17043-2010', label: 'ISO 17043:2010' },
            assess_level_col: { id: 'eric', label: 'BBMRI-ERIC audited' }
          }
        ]

        const expected = ['col-1', 'col-2']

        mutations.SetCollectionQualityCollections(state, payload)

        expect(state.collection_quality.collections).toStrictEqual(expected)
      })

      it('should set an invalid collection id when the filter applied on the col quality standards returns no matching cols', () => {
        state.collection_quality.filters = ['eric']

        const payload = []

        const expected = ['invalid_collection']

        mutations.SetCollectionQualityCollections(state, payload)

        expect(state.collection_quality.collections).toStrictEqual(expected)
      })
    })

    describe('SetBiobankReport', () => {
      it('should set the biobank report value in the state with the payload', () => {
        const payload = { id: 'biobank-1-other' }
        mutations.SetBiobankReport(state, payload)
        expect(state.biobankReport).toStrictEqual(payload)
      })
    })

    describe('SetCollectionReport', () => {
      it('should set the collection report value in the state with the payload', () => {
        const payload = {
          _meta: {
            name: 'meta'
          },
          id: '001',
          name: 'beautiful collection',
          description: 'beautiful samples'
        }

        mutations.SetCollectionReport(state, payload)

        expect(state.collectionReport).toStrictEqual(payload)
      })
    })

    describe('SetNetworkReport', () => {
      it('should set the network report value in the state with the payload', () => {
        const payload = {
          _meta: {
            name: 'meta'
          },
          id: '001',
          name: 'beautiful network',
          description: 'beautiful data'
        }

        mutations.SetNetworkReport(state, payload)

        expect(state.networkReport.network).toStrictEqual(payload)
      })
    })

    describe('SetNetworkCollections', () => {
      it('should set the network collections in the state with the payload', () => {
        const payload = []
        mutations.SetNetworkCollections(state, payload)
        expect(state.networkReport.collections).toStrictEqual(payload)
      })
    })

    describe('SetNetworkBiobanks', () => {
      it('should set the network biobanks in the state with the payload', () => {
        const payload = []
        mutations.SetNetworkBiobanks(state, payload)
        expect(state.networkReport.biobanks).toStrictEqual(payload)
      })
    })

    describe('SetLoading', () => {
      it('should set the loading boolean in the state', () => {
        mutations.SetLoading(state, true)
        expect(state.isLoading).toStrictEqual(true)
      })
    })

    describe('SetLoading', () => {
      it('should set the loading boolean in the state', () => {
        mutations.SetLoading(state, true)
        expect(state.isLoading).toStrictEqual(true)
      })
    })

    describe('Negotiator logic', () => {
      it('should set the Podium boolean if any row in the negotiator config includes podium', () => {
        mutations.SetPodium(state, { items: [{ id: 'podium-identifier' }] })
        expect(state.isPodium).toStrictEqual(true)
      })

      it('should map podium collection ids from response', () => {
        const response = {
          items: [
            { data: { id: 'A' } },
            { data: { id: 'B' } },
            { data: { id: 'C' } }
          ]
        }

        mutations.SetPodiumCollections(state, response)
        expect(state.podiumCollectionIds).toStrictEqual(['A', 'B', 'C'])
      })

      it('should set the should get the correct tables from the negotiator config', () => {
        const response = {
          items: [{
            id: 'bbmri-eric-model',
            entity: {
              id: 'table_for_collection'
            },
            biobankId: {
              refEntityType: {
                id: 'table_for_biobank'
              }
            }
          }]
        }

        mutations.SetNegotiatorEntities(state, response)
        expect(state.negotiatorCollectionEntityId).toStrictEqual('table_for_collection')
        expect(state.negotiatorBiobankEntityId).toStrictEqual('table_for_biobank')
      })
    })
  })
})
