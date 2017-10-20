import { expect } from 'chai'
import mutations from 'src/store/mutations'

describe('mutations', () => {
  describe('SET_COUNTRIES', () => {
    it('should set the countries in the state with the payload', () => {
      const state = {
        country: {
          options: []
        }
      }

      const countries = ['NL', 'BE', 'DE']
      mutations.__SET_COUNTRIES__(state, countries)

      expect(state.country.options).to.deep.equal(countries)
    })
  })

  describe('SET_MATERIALS', () => {
    it('should set the material types in the state with the payload', () => {
      const state = {
        materials: {
          options: []
        }
      }

      const materials = ['PLASMA', 'RNA', 'DNA']
      mutations.__SET_MATERIALS__(state, materials)

      expect(state.materials.options).to.deep.equal(materials)
    })
  })

  describe('SET_STANDARDS', () => {
    it('should set the qualities in the state with the payload', () => {
      const state = {
        standards: {
          options: []
        }
      }

      const standards = ['cen-ts-16826-1-2015']
      mutations.__SET_STANDARDS__(state, standards)

      expect(state.standards.options).to.deep.equal(standards)
    })
  })

  describe('SET_DIAGNOSIS_AVAILABLE', () => {
    it('should set the diagnosis available in the state with the payload', () => {
      const state = {
        diagnosis_available: {
          options: []
        }
      }

      const diagnoses = ['C18', 'L40']
      mutations.__SET_DIAGNOSIS_AVAILABLE__(state, diagnoses)

      expect(state.diagnosis_available.options).to.deep.equal(diagnoses)
    })
  })

  describe('UPDATE_FILTER', () => {
    it('should update the list of filters for a specific state key', () => {
      const state = {
        country: {
          filters: []
        }
      }

      const countries = ['NL', 'BE']
      mutations.__UPDATE_FILTER__(state, {name: 'country', filters: countries})

      expect(state.country.filters).to.deep.equal(countries)
    })
  })

  describe('SET_BIOBANKS', () => {
    it('should set the biobanks in the state with the payload', () => {
      const state = {
        biobanks: []
      }

      const biobanks = [{id: 'biobank1'}, {id: 'biobank2'}]
      mutations.__SET_BIOBANKS__(state, biobanks)

      expect(state.biobanks).to.deep.equal(biobanks)
    })
  })

  describe('SET_ERROR', () => {
    it('should set the error in the state with the payload', () => {
      const state = {
        error: undefined
      }

      const error = 'error'
      mutations.__SET_ERROR__(state, error)

      expect(state.error).to.equal(error)
    })
  })

  describe('SET_SEARCH', () => {
    it('should set the search query in the state with the payload', () => {
      const state = {
        search: ''
      }

      const search = 'this is a search'
      mutations.__SET_SEARCH__(state, search)

      expect(state.search).to.equal(search)
    })
  })

  describe('MAP_QUERY_TO_STATE', () => {
    it('should map the query values from the router to the state', () => {
      const state = {
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
        },
        search: '',
        nToken: null
      }

      const query = {
        search: 'free text search',
        country: 'NL,BE',
        materials: 'PLASMA,RNA,DNA',
        standards: 'cen-ts-16826-1-2015,cen-ts-17238-1-2016',
        diagnosis_available: 'C18,L40',
        nToken: 'jsh72938ShZ!2304DkdlfLLSds0923!s'
      }
      mutations.__MAP_QUERY_TO_STATE__(state, query)

      expect(state.search).to.equal('free text search')
      expect(state.country.filters).to.deep.equal(['NL', 'BE'])
      expect(state.materials.filters).to.deep.equal(['PLASMA', 'RNA', 'DNA'])
      expect(state.standards.filters).to.deep.equal(['cen-ts-16826-1-2015', 'cen-ts-17238-1-2016'])
      expect(state.diagnosis_available.filters).to.deep.equal(['C18', 'L40'])
      expect(state.nToken).to.equal('jsh72938ShZ!2304DkdlfLLSds0923!s')
    })
  })

  describe('MAP_DIAGNOSIS_AVAILABLE_QUERY_TO_STATE', () => {
    it('should set the list of selected diagnosis filers with the payload', () => {
      const state = {
        diagnosis_available: {
          filters: []
        }
      }

      const filters = [{id: '1'}, {id: '2'}]
      mutations.__MAP_DIAGNOSIS_AVAILABLE_QUERY_TO_STATE__(state, filters)

      expect(state.diagnosis_available.filters).to.deep.equal(filters)
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
