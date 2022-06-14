import mutations from '../../../../../src/store/mutations'
import { mockState } from '../../mockData'

let state
describe('store', () => {
  beforeEach(() => {
    state = mockState()
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

  describe('SetBiobankCount', () => {
    it('can set the initial biobank ids and count if initialBiobankCount is undefined or 0', () => {
      const response = {
        items: [{
          data: {
            id: 'testId'
          }
        }],
        page: {
          totalElements: 1
        }
      }
      mutations.SetBiobankCount(state, response)
      expect(state.biobankCount).toBe(1)
      expect(state.initialBiobankCount).toBe(1)
      expect(state.initialBiobankIds).toStrictEqual(['testId'])
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

  describe('SetBiobankReport', () => {
    it('should set the biobank report value in the state with the payload', () => {
      const payload = { id: 'biobank-1-other' }
      mutations.SetBiobankReport(state, payload)
      expect(state.biobankReport).toStrictEqual(payload)
    })
  })
})
