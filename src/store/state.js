export const INITIAL_STATE = window.__INITIAL_STATE__ || {}

export default {
  error: null,
  biobanks: [],
  search: '',
  nToken: null,
  loading: false,
  country: {
    filters: [],
    options: []
  },
  materials: {
    filters: [],
    options: []
  },
  standards: {
    filters: [],
    options: []
  },
  diagnosis_available: {
    filters: [],
    options: []
  }
}
