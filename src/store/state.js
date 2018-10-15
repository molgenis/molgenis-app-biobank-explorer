export const INITIAL_STATE = window.__INITIAL_STATE__ || {}

export default {
  error: null,
  showCountryFacet: !!(INITIAL_STATE.runtimeOptions && INITIAL_STATE.runtimeOptions.showCountryFacet === true), // defaults to true
  preConfiguredCountyCode: INITIAL_STATE.runtimeOptions ? INITIAL_STATE.runtimeOptions.preConfiguredCountyCode : undefined,
  allBiobanks: undefined,
  biobankIds: undefined,
  /* A single biobank object which is fetched by ID for showing the BiobankReportCard component */
  biobankReport: {
    data: {},
    metadata: {}
  },
  search: '',
  /* Randomly generated 32 character token provided by the Negotiator
  when they want to edit an existing query */
  nToken: null,
  country: {
    filters: [],
    options: []
  },
  materials: {
    filters: [],
    options: []
  },
  collection_quality: {
    filters: [],
    options: [],
    collections: []
  },
  biobank_quality: {
    filters: [],
    options: [],
    biobanks: []
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
