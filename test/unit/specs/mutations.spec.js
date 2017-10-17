import { expect } from 'chai'
import mutations from 'src/store/mutations'

describe('mutations', () => {
  describe('SET_BIOBANKS', () => {
    it('should set the biobanks in the state with the payload', () => {
      const state = {
        biobanks: []
      }
      const payload = [
        {id: 'biobank1'},
        {id: 'biobank2'}
      ]

      mutations.__SET_BIOBANKS__(state, payload)

      expect(state.biobanks).to.deep.equal(payload)
    })
  })

  describe('SET_COUNTRIES', () => {
    it('should set the countries in the state with the payload', () => {
      const state = {
        filters: {
          countries: {
            options: []
          }
        }
      }

      const payload = ['NL', 'BE', 'DE']
      mutations.__SET_COUNTRIES__(state, payload)

      expect(state.filters.countries.options).to.deep.equal(payload)
    })
  })

  describe('SET_MATERIAL_TYPES', () => {
    it('should set the material types in the state with the payload', () => {
      const state = {
        filters: {
          material_types: {
            options: []
          }
        }
      }

      const payload = ['PLASMA', 'RNA', 'DNA']
      mutations.__SET_MATERIAL_TYPES__(state, payload)

      expect(state.filters.material_types.options).to.deep.equal(payload)
    })
  })

  describe('SET_QUALITY', () => {
    it('should set the qualities in the state with the payload', () => {
      const state = {
        filters: {
          quality: {
            options: []
          }
        }
      }

      const payload = ['cen-ts-16826-1-2015']
      mutations.__SET_QUALITY__(state, payload)

      expect(state.filters.quality.options).to.deep.equal(payload)
    })
  })

  describe('SET_FILTER', () => {
    it('should set the selected options for the filter specified in the payload', () => {
      const state = {
        filters: {
          countries: {
            selectedOptions: []
          }
        }
      }

      const payload = {
        name: 'countries',
        newSelectedOptions: ['NL', 'BE']
      }
      mutations.__SET_FILTER__(state, payload)

      expect(state.filters.countries.selectedOptions).to.deep.equal(payload.newSelectedOptions)
    })
  })

  describe('SET_ERROR', () => {
    it('should set the error in the state with the payload', () => {
      const state = {
        error: undefined
      }

      const payload = 'error'
      mutations.__SET_ERROR__(state, payload)

      expect(state.error).to.equal(payload)
    })
  })

  describe('SET_SEARCH', () => {
    it('should set the search query in the state with the payload', () => {
      const state = {
        search: ''
      }

      const payload = 'this is a search'
      mutations.__SET_SEARCH__(state, payload)

      expect(state.search).to.equal(payload)
    })
  })

  describe('MAP_QUERY_TO_STATE', () => {
    it('should map the query values from the router to the state', () => {
      const state = {
        filters: {
          countries: {selectedOptions: []},
          material_types: {selectedOptions: []},
          quality: {selectedOptions: []}
        },
        search: '',
        nToken: null
      }

      const payload = {
        search: 'free text search',
        countries: 'NL,BE',
        materialTypes: 'PLASMA,RNA,DNA',
        quality: 'cen-ts-16826-1-2015,cen-ts-17238-1-2016',
        nToken: 'jsh72938ShZ!2304DkdlfLLSds0923!s'
      }
      mutations.__MAP_QUERY_TO_STATE__(state, payload)

      expect(state.search).to.equal('free text search')
      expect(state.filters.countries.selectedOptions).to.deep.equal(['NL', 'BE'])
      expect(state.filters.material_types.selectedOptions).to.deep.equal(['PLASMA', 'RNA', 'DNA'])
      expect(state.filters.quality.selectedOptions).to.deep.equal(['cen-ts-16826-1-2015', 'cen-ts-17238-1-2016'])
      expect(state.nToken).to.equal('jsh72938ShZ!2304DkdlfLLSds0923!s')
    })
  })

  describe('SET_LOADING', () => {
    it('should set loading value in the state with the payload', () => {
      const state = {
        loading: false
      }

      const payload = true
      mutations.__SET_LOADING__(state, payload)

      expect(state.loading).to.equal(payload)
    })
  })
})
