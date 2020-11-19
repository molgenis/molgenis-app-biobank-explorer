import mutations from '../../../../src/store/mutations'
import { mockState } from '../mockState'

let state

describe('store', () => {
  beforeEach(() => {
    state = mockState()
  })
  describe('mutations', () => {
    describe('CovidNetworkFilter', () => {
      it('should set covid19 network filter for biobank if it is not present already', () => {
        expect(state.filters.selections.biobank_network).toBe(undefined)

        mutations.SetCovidNetworkFilter(state, { name: 'biobank_network', value: { text: 'Covid-19', value: 'COVID_19' }, router: [] })
        expect(state.filters.selections.biobank_network).toStrictEqual(['COVID_19'])
      })
      it('should not set covid19 network filter again for biobank if it is present already', () => {
        state.filters.selections.biobank_network = ['COVID_19']
        state.filters.labels.biobank_network = ['Covid-19']

        expect(state.filters.selections.biobank_network).toStrictEqual(['COVID_19'])

        mutations.SetCovidNetworkFilter(state, { name: 'biobank_network', value: { text: 'Covid-19', value: 'COVID_19' }, router: [] })
        expect(state.filters.selections.biobank_network).toStrictEqual(['COVID_19'])
      })

      it('should remove covid19 network filter for biobank if it is present already', () => {
        state.filters.selections.biobank_network = ['COVID_19']
        state.filters.labels.biobank_network = ['Covid-19']

        expect(state.filters.selections.biobank_network).toStrictEqual(['COVID_19'])

        mutations.UnsetCovidNetworkFilter(state, { name: 'biobank_network', value: { text: 'Covid-19', value: 'COVID_19' }, router: [] })
        expect(state.filters.selections.biobank_network).toStrictEqual([])
      })
    })
    describe('UpdateFilter', () => {
      it('should update the list of filters for a specific state key and map its text as label', () => {
        const countries = [{ value: 'NL', text: 'Netherlands' }, { value: 'BE', text: 'Belgium' }]
        mutations.UpdateFilter(state, { name: 'country', value: countries, router: [] })

        expect(state.filters.selections.country).toStrictEqual(['NL', 'BE'])
        expect(state.filters.labels.country).toStrictEqual(['Netherlands', 'Belgium'])
      })
    })

    describe('ResetFilters', () => {
      it('should reset all the filters in the state', () => {
        state.filters.selections = {
          country: ['AT'],
          materials: ['PLASMA'],
          diagnosis_available: ['C18'],
          collection_quality: ['Awesome standard'],
          biobank_quality: ['Awesome standard'],
          type: ['type'],
          covid19: ['covid19'],
          dataType: ['type']
        }
        expect(state.filters.selections.country).toEqual(['AT'])
        mutations.ResetFilters(state)
        expect(state.filters.selections).toStrictEqual({})
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

    describe('MapQueryToState', () => {
      it('should map everything from router query to state', () => {
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

        expect(state.filters.selections.country).toStrictEqual(['NL', 'BE'])
        expect(state.filters.selections.materials).toStrictEqual(['RNA', 'PLASMA'])
        expect(state.filters.selections.type).toStrictEqual(['BIRTH_COHORT'])
        expect(state.filters.selections.covid19).toStrictEqual(['covid19'])
        expect(state.filters.selections.dataType).toStrictEqual(['BIOLOGICAL_SAMPLES'])
        expect(state.filters.selections.collection_quality).toStrictEqual(['eric', 'self'])
        expect(state.filters.selections.covid19).toStrictEqual(['covid19'])
        expect(state.filters.selections.biobank_network).toStrictEqual(['networkA', 'networkB'])
        expect(state.filters.selections.biobank_quality).toStrictEqual(['qualityA'])
        expect(state.filters.selections.search).toBe('search')
        expect(state.nToken).toBe('29djgCm29104958f7dLqopf92JDJKS')
      })
    })

    describe('SetBiobankIdsWithSelectedQuality', () => {
      it('should set the biobanks that match the applied quality standards filter', () => {
        state.filters.selections.biobank_quality = ['eric']

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
        const payload = {
          items: [
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
        }

        const expected = ['col-1', 'col-2']

        mutations.SetCollectionIdsWithSelectedQuality(state, payload)

        expect(state.collectionIdsWithSelectedQuality).toStrictEqual(expected)
      })

      it('should set an invalid collection id when the filter applied on the col quality standards returns no matching cols', () => {
        state.filters.selections.collection_quality = ['eric']

        const payload = []

        const expected = ['no-collection-found']

        mutations.SetCollectionIdsWithSelectedQuality(state, payload)

        expect(state.collectionIdsWithSelectedQuality).toStrictEqual(expected)
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
