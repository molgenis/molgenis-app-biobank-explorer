export const INITIAL_STATE = window.__INITIAL_STATE__ || {}

export default {
  bookmarkMappedToState: false,
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
  /* A single biobank object which is fetched by ID for showing the BiobankReportCard component */
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
  filterIdLabelDictionary: {},
  filters: {
    selections: {},
    labels: {} // for human readable string
  },
  filterLabelCache: []
}
