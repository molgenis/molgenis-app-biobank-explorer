import mutations from '../../../../src/store/mutations'
import { mockCollectionResponse, mockState } from '../mockData'

import store from '@/store'
jest.mock('@/store')
store.commit = jest.fn()

let state
describe('store', () => {
  beforeEach(() => {
    state = mockState()
  })
  describe('mutations', () => {
    describe('UpdateFilterSelection', () => {
      it('should set covid19 network filter for biobank if it is not present already', async () => {
        expect(state.filters.selections.network).toBe(undefined)

        mutations.UpdateFilterSelection(state, { name: 'network', value: { text: 'Covid-19', value: 'COVID_19' } })
        expect(state.filters.selections.network).toStrictEqual(['COVID_19'])
        expect(state.filters.labels.network).toStrictEqual(['Covid-19'])
      })

      it('should remove covid19 network filter for biobank when unchecked', () => {
        state.filters.selections.network = ['COVID_19']
        state.filters.labels.network = ['Covid-19']

        expect(state.filters.selections.network).toStrictEqual(['COVID_19'])

        mutations.UpdateFilterSelection(state, { name: 'network', value: { text: 'Covid-19', value: [] } })
        expect(state.filters.selections.network).toBeUndefined()
        expect(state.filters.labels.network).toBeUndefined()
      })

      it('should update the list of filters for a specific state key and map its text as label', () => {
        const countries = [{ value: 'NL', text: 'Netherlands' }, { value: 'BE', text: 'Belgium' }]
        mutations.UpdateFilterSelection(state, { name: 'country', value: countries })

        expect(state.filters.selections.country).toStrictEqual(['NL', 'BE'])
        expect(state.filters.labels.country).toStrictEqual(['Netherlands', 'Belgium'])
      })

      it('should treat the search filter value as a string', () => {
        mutations.UpdateFilterSelection(state, { name: 'search', value: 'free text search' })

        expect(state.filters.selections.search).toBe('free text search')
        expect(state.filters.labels.search).toBeUndefined()
      })

      it('should remove a filter when it has an array with an empty string as value', () => {
        state.filters.selections.diagnosis_available = ['unknown_disease']

        mutations.UpdateFilterSelection(state, { name: 'diagnosis_available', value: { text: 'Unknown disease', value: [''] } })
        expect(state.filters.selections.diagnosis_available).toBeUndefined()
      })

      it('can set all filters', () => {
        state.filters.labels.country = ['Netherlands', 'Belgium', 'France']
        state.filters.selections = {
          search: 'Free text search',
          country: ['BE', 'NL', 'FR']
        }

        const newSelections = {
          search: 'Free text search',
          country: [{ value: 'NL', text: 'Netherlands' }, { value: 'BE', text: 'Belgium' }]
        }

        mutations.UpdateFilterSelection(state, newSelections)

        expect(state.filters.selections).toStrictEqual({
          search: 'Free text search',
          country: ['NL', 'BE']
        })

        expect(state.filters.labels).toStrictEqual({ country: ['Netherlands', 'Belgium'] })
      })
    })

    describe('UpdateFilterSatisfyAll', () => {
      it('can set to a specific filter the satisfy all value to true/false', () => {
        mutations.UpdateFilterSatisfyAll(state, { name: 'biobank_capabilities', value: true })
        expect(state.filters.satisfyAll.includes('biobank_capabilities')).toStrictEqual(true)
      })

      it('can delete the entry in the satisfyAll array if its filter\'s satisfyAll flag value changes', () => {
        state.filters.satisfyAll = ['diagnosis_available', 'biobank_capabilities', 'materials']
        mutations.UpdateFilterSatisfyAll(state, { name: 'biobank_capabilities', value: false })
        expect(state.filters.satisfyAll.includes('biobank_capabilities')).toStrictEqual(false)
        expect(state.filters.satisfyAll.includes('diagnosis_available')).toStrictEqual(true)
        expect(state.filters.satisfyAll.includes('materials')).toStrictEqual(true)
      })
    })

    describe('ClearActiveFilters', () => {
      it('should reset all the filters in the state', () => {
        state.filters.selections = {
          country: ['AT'],
          materials: ['PLASMA'],
          diagnosis_available: ['C18'],
          type: ['type'],
          biobank_capabilities: ['biobank_capabilities'],
          dataType: ['type']
        }
        expect(state.filters.selections.country).toEqual(['AT'])
        mutations.ClearActiveFilters(state)
        expect(state.filters.selections).toStrictEqual({})
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
        state.collectionNameDictionary = {
          'bbmri-eric:ID:TR_ACU:collection:covid19': 'My test collection'
        }

        state.route = {
          query: {
            /** legacy: can be in negotiator url */
            collection_quality: 'eric,qualityA',
            biobank_network: 'legacyBiobankNetworkA,legacyNetworkA',
            collection_network: 'legacyCollectionNetworkA,legacyNetworkA',
            biobank_quality: 'qualityA',
            /** end legacy */
            country: 'NL,BE',
            materials: 'RNA,PLASMA',
            search: 'search',
            type: 'BIRTH_COHORT',
            dataType: 'BIOLOGICAL_SAMPLES',
            nToken: '29djgCm29104958f7dLqopf92JDJKS',
            network: 'networkA,networkB',
            biobank_capabilities: 'covid19',
            cart: 'YmJtcmktZXJpYzpJRDpUUl9BQ1U6Y29sbGVjdGlvbjpjb3ZpZDE5',
            satisfyAll: 'covid19,materials'
          }
        }

        mutations.MapQueryToState(state)

        expect(state.filters.selections.country).toStrictEqual(['NL', 'BE'])
        expect(state.filters.selections.materials).toStrictEqual(['RNA', 'PLASMA'])
        expect(state.filters.selections.type).toStrictEqual(['BIRTH_COHORT'])
        expect(state.filters.selections.dataType).toStrictEqual(['BIOLOGICAL_SAMPLES'])
        expect(state.filters.selections.combined_quality).toStrictEqual(['eric', 'qualityA'])
        expect(state.filters.selections.biobank_capabilities).toStrictEqual(['covid19'])
        expect(state.filters.selections.network).toStrictEqual(['networkA', 'networkB', 'legacyCollectionNetworkA', 'legacyNetworkA', 'legacyBiobankNetworkA'])
        expect(state.filters.selections.search).toBe('search')
        expect(state.nToken).toBe('29djgCm29104958f7dLqopf92JDJKS')
        expect(state.selectedCollections).toEqual([{
          label: 'My test collection',
          value: 'bbmri-eric:ID:TR_ACU:collection:covid19'
        }])
        expect(state.filters.satisfyAll).toStrictEqual(['covid19', 'materials'])
      })

      it('should be backwards compatible with previous saved ICD-10 codes', () => {
        state.route = {
          query: {
            diagnosis_available: 'urn:miriam:icd:C15,D00,C10.3,ORPHA:1000'
          }
        }

        mutations.MapQueryToState(state)

        expect(state.filters.selections.diagnosis_available).toStrictEqual(['urn:miriam:icd:C15', 'urn:miriam:icd:D00', 'urn:miriam:icd:C10.3', 'ORPHA:1000'])
      })
    })

    describe('SetAllCollectionRelationData', () => {
      it('Can set a dictionary for Collection & Biobank', () => {
        const response = mockCollectionResponse
        mutations.SetAllCollectionRelationData(state, response)

        expect(state.collectionBiobankDictionary).toEqual({ 'bbmri-eric:ID:NL_AAAACXPAF5YXYACQK2ME25QAAM:collection:124': 'AMC Renal Transplant Biobank', 'bbmri-eric:ID:NL_AAAACXPJ3VCTUACQK2ME25QAAE:collection:211': 'ARGOS Biobank', 'bbmri-eric:ID:NL_AAAACXPKMVPYIACQK2ME25QAAE:collection:92': 'ARREST Biobank', 'bbmri-eric:ID:NL_AAAACYWY5TBZGACQK2MDM4QAAE:collection:89': 'AGNES Biobank', 'bbmri-eric:ID:NL_AMCBB:collection:AB17-022': 'Amsterdam UMC Biobank: Location AMC' })
        expect(state.collectionNameDictionary).toEqual({ 'bbmri-eric:ID:NL_AAAACXPAF5YXYACQK2ME25QAAM:collection:124': 'AMC Renal Transplant Biobank', 'bbmri-eric:ID:NL_AAAACXPJ3VCTUACQK2ME25QAAE:collection:211': 'Association study of coronary heart disease Risk factors in the Genome using an Old-versus-young Setting', 'bbmri-eric:ID:NL_AAAACXPKMVPYIACQK2ME25QAAE:collection:92': 'Amsterdam Ressucitation Studies', 'bbmri-eric:ID:NL_AAAACYWY5TBZGACQK2MDM4QAAE:collection:89': 'Arrhythmia genetics in the Netherlands', 'bbmri-eric:ID:NL_AMCBB:collection:AB17-022': 'Physical Activity and Dietary intervention in OVArian cancer (PADOVA): a RCT evaluating effects on body composition, physical function, and fatigue' })
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
    })

    describe('ConfigureFilters', () => {
      it('can add a custom filter and assign a function to options based on config', () => {
        state.filterFacets.push({
          tableName: 'eu_bbmri_eric_data_types',
          columnName: 'data_categories',
          negotiatorDescription: 'Where data category is: ',
          facetTitle: 'Test facet'
        })

        mutations.ConfigureFilters(state)

        const configFilter = state.filterFacets.find(f => f.label === 'Test facet')

        // assert that the configFilter has an options function
        expect(typeof configFilter.options).toBe('function')
      })
    })

    describe('Collection state handling', () => {
      it('should invalidate the cart if collections are added without bookmark', () => {
        // initial state verification
        expect(state.cartValid).toBeTruthy()

        mutations.SetCollectionsToSelection(state, { collections: ['collectionA'] })
        expect(state.selectedCollections).toEqual(['collectionA'])
        expect(state.cartValid).toBeFalsy()
      })

      it('should not invalidate the cart if collections are added with bookmark', () => {
        // initial state verification
        expect(state.cartValid).toBeTruthy()

        mutations.SetCollectionsToSelection(state, { collections: ['collectionA'], bookmark: true })
        expect(state.selectedCollections).toEqual(['collectionA'])
        expect(state.cartValid).toBeTruthy()
      })

      it('should invalidate the cart if collections are removed without bookmark', () => {
        state.selectedCollections = ['collectionA']

        // initial state verification
        expect(state.cartValid).toBeTruthy()

        mutations.RemoveCollectionsFromSelection(state, { collections: ['collectionA'] })
        expect(state.selectedCollections).toEqual([])
        expect(state.cartValid).toBeFalsy()
      })

      it('should not invalidate the cart if collections are removed with bookmark', () => {
        // initial state verification
        expect(state.cartValid).toBeTruthy()

        mutations.RemoveCollectionsFromSelection(state, { collections: ['collectionA'], bookmark: true })
        expect(state.selectedCollections).toEqual([])
        expect(state.cartValid).toBeTruthy()
      })
    })

    describe('SetNotification', () => {
      it('should set the loading boolean in the state', () => {
        expect(state.notification).toBe(undefined)
        mutations.SetNotification(state, 'notify this message')
        expect(state.notification).toStrictEqual('notify this message')
      })
    })
  })
})
