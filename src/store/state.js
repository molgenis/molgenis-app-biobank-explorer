export const INITIAL_STATE = window.__INITIAL_STATE__ || {}

// Create an object type AppConfigurationException
function AppConfigurationException (message: string) {
  this.message = message
  this.name = 'ConfigurationException'
}

if (window.__INITIAL_STATE__ && window.__INITIAL_STATE__.showCountryFacet === false && !window.__INITIAL_STATE__.preConfiguredCountyCode) {
  throw new AppConfigurationException('You have to specify a preconfigured country code in your app-configuration.')
}

export default {
  error: null,
  showCountryFacet: INITIAL_STATE.hasOwnProperty('showCountryFacet') ? INITIAL_STATE.showCountryFacet : true,
  preConfiguredCountyCode: INITIAL_STATE.preConfiguredCountyCode,
  allBiobanks: undefined,
  collectionIds: undefined,
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
  diagnoses: [],
  type: {
    filters: [],
    options: []
  },
  dataType: {
    filters: [],
    options: []
  }
}
