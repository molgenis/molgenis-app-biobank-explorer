import { expect } from 'chai'
import getters from 'src/store/getters'

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

  describe('getRouteQueryParams', () => {
    let state = getInitialState()
    afterEach(() => { state = getInitialState() })

    it('should create a query object containing filters for: free text search', () => {
      state.search = 'free text search'

      const actual = getters.getRouteQueryParams(state)
      const expected = {
        search: 'free text search'
      }

      expect(actual).to.deep.equal(expected)
    })

    it('should create a query object containing filters for: country', () => {
      state.country.filters.push('NL', 'BE')

      const actual = getters.getRouteQueryParams(state)
      const expected = {
        country: 'NL,BE'
      }

      expect(actual).to.deep.equal(expected)
    })

    it('should create a query object containing filters for: materials', () => {
      state.materials.filters.push('RNA', 'PLASMA')

      const actual = getters.getRouteQueryParams(state)
      const expected = {
        materials: 'RNA,PLASMA'
      }

      expect(actual).to.deep.equal(expected)
    })

    it('should create a query object containing filters for: standards', () => {
      state.standards.filters.push('cen-ts-16826-1-2015', 'cen-ts-17238-1-2016')

      const actual = getters.getRouteQueryParams(state)
      const expected = {
        standards: 'cen-ts-16826-1-2015,cen-ts-17238-1-2016'
      }

      expect(actual).to.deep.equal(expected)
    })

    it('should create a query object containing filters for: diagnosis available', () => {
      state.diagnosis_available.filters.push({code: 'C18'}, {code: 'L40'})

      const actual = getters.getRouteQueryParams(state)
      const expected = {
        diagnosis_available: 'C18,L40'
      }

      expect(actual).to.deep.equal(expected)
    })
  })
})
