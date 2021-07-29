export const INITIAL_STATE = window.__INITIAL_STATE__ || {}

export default {
  isIE11: window.ActiveXObject !== undefined && 'ActiveXObject' in window,
  ie11Bookmark: '',
  negotiatorCollectionEntityId: '',
  negotiatorBiobankEntityId: '',
  isLoading: false,
  isPodium: false,
  podiumCollectionIds: [],
  error: null,
  showCountryFacet: Object.hasOwnProperty.call(INITIAL_STATE, 'showCountryFacet') ? INITIAL_STATE.showCountryFacet : true,
  // Map ID to biobank
  biobanks: {},
  // IDs of biobanks matching the biobank filters
  biobankIds: undefined,
  // IDs of collections matching the collection filters
  collectionInfo: undefined,
  /* A single biobank object which is fetched by ID for showing the BiobankReport view */
  biobankReport: undefined,
  collectionReport: undefined,
  networkReport: {
    network: undefined,
    collections: undefined,
    biobanks: undefined
  },
  /* Randomly generated 32 character token provided by the Negotiator
  when they want to edit an existing query */
  nToken: null,
  collectionIdsWithSelectedQuality: [],
  biobankIdsWithSelectedQuality: [],
  collectionBiobankDictionary: {},
  collectionDictionary: {},
  qualityStandardsDictionary: {},
  nonCommercialCollections: [],
  selectedCollections: [],
  filters: {
    selections: {},
    satisfyAll: [],
    labels: {} // for human readable string
  },
  // caching filter options for performance
  filterOptionDictionary: {},
  // whenever a user returns from a bookmark with diagnosis available
  // in the active filter, there is no label. fetch it once for performance
  diagnosisAvailableFetched: false
}
