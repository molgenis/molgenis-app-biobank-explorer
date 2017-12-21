import { expect } from 'chai'
import getters from 'src/store/getters'

describe('getters', () => {
  describe('getCountryOptions', () => {
    it('should retrieve the options that are available for the country filter', () => {
      const state = {
        country: {
          options: ['AT', 'BE']
        }
      }

      const actual = getters.getCountryOptions(state)
      const expected = ['AT', 'BE']

      expect(actual).to.deep.equal(expected)
    })
  })

  describe('getMaterialOptions', () => {
    it('should retrieve the options that are available for the material type filter', () => {
      const state = {
        materials: {
          options: ['RNA', 'DNA']
        }
      }

      const actual = getters.getMaterialOptions(state)
      const expected = ['RNA', 'DNA']

      expect(actual).to.deep.equal(expected)
    })
  })

  describe('getStandardsOptions', () => {
    it('should retrieve the options that are available for the standards filter', () => {
      const state = {
        standards: {
          options: ['cen-ts-16826-1-2015', 'cen-ts-17238-1-2016']
        }
      }

      const actual = getters.getStandardsOptions(state)
      const expected = ['cen-ts-16826-1-2015', 'cen-ts-17238-1-2016']

      expect(actual).to.deep.equal(expected)
    })
  })

  describe('getDiagnosisAvailableOptions', () => {
    it('should retrieve the options that are available for the disease type filter', () => {
      const state = {
        diagnosis_available: {
          options: [
            {id: '1', label: 'small disease'},
            {id: '2', label: 'big disease'}
          ]
        }
      }

      const actual = getters.getDiagnosisAvailableOptions(state)
      const expected = [
        {id: '1', label: 'small disease'},
        {id: '2', label: 'big disease'}
      ]

      expect(actual).to.deep.equal(expected)
    })
  })

  describe('getActiveFilters', () => {
    it('should retrieve an object of filter name <-> filters', () => {
      const state = {
        country: {
          filters: ['AT'],
          options: [{id: 'AT', name: 'Austria'}]
        },
        materials: {
          filters: ['PLASMA'],
          options: [{id: 'PLASMA', label: 'Plasma'}]
        },
        diagnosis_available: {
          filters: [],
          options: []
        },
        standards: {
          filters: [],
          options: []
        }
      }

      const actual = getters.getActiveFilters(state)
      const expected = {
        'materials': [
          {id: 'PLASMA', label: 'Plasma'}
        ],
        'country': [
          {id: 'AT', label: 'Austria'}
        ]
      }

      expect(actual).to.deep.equal(expected)
    })
  })
})
