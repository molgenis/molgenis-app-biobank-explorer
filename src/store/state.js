export const INITIAL_STATE = window.__INITIAL_STATE__ || {}

export default {
  error: null,
  biobanks: [],
  /* A single biobank object which is fetched by ID for showing the BiobankReportCard component */
  biobankReport: {
    data: {},
    metadata: {}
  },
  search: '',
  /* Randomly generated 32 character token provided by the Negotiator
  when they want to edit an existing query */
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
  },
  type: {
    filters: [],
    options: []
  },
  dataType: {
    filters: [],
    options: []
  }
}
