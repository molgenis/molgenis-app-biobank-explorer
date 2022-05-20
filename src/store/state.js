import { bbmriConfig } from '../config/configManager'

const config = bbmriConfig()

export const INITIAL_STATE = window.__INITIAL_STATE__ || {}

export default {
  language: 'en',
  applicationContext: {},
  appConfigId: '',
  appConfig: {},
  configUpdateStatus: 0,
  cartValid: true,
  negotiatorCollectionEntityId: '',
  negotiatorBiobankEntityId: '',
  i18n: config.i18n,
  removeFreemarkerMargin: config.removeFreemarkerMargin,
  biobankCardShowCollections: config.biobankCardShowCollections,
  filterMenuInitiallyFolded: config.filterMenuInitiallyFolded,
  isLoading: false,
  currentPage: 1,
  pageSize: 12,
  initialBiobankCount: 0,
  initialBiobankIds: [],
  biobankCount: 0,
  isPodium: false,
  podiumCollectionIds: [],
  error: null,
  biobankColumns: config.biobankColumns,
  collectionColumns: config.collectionColumns,
  filterFacets: config.filterFacets,
  menuHeight: config.menuHeight, // standard menu height in pixels for use in sticky-position
  biobanks: {}, // Map ID to biobank
  biobankIds: undefined, // IDs of biobanks matching the biobank filters
  collectionInfo: undefined, // IDs of collections matching the collection filters
  biobankReport: undefined, // A single biobank object which is fetched by ID for showing the BiobankReport view
  collectionReport: undefined,
  networkReport: {
    network: undefined,
    collections: undefined,
    biobanks: undefined
  },
  nToken: null, // Randomly generated 32 character token provided by the Negotiator when they want to edit an existing query
  collectionIdsWithSelectedQuality: [],
  biobankIdsWithSelectedQuality: [],
  collectionBiobankDictionary: {},
  collectionNameDictionary: {},
  collectionRelationData: [], // All the data of the structure of the model is here.
  qualityStandardsDictionary: {},
  nonCommercialCollections: [],
  selectedCollections: [],
  filters: {
    selections: {},
    satisfyAll: [],
    labels: {} // for human readable string
  },
  searchHistory: [], // hold the current search history
  filterOptionDictionary: {}, // caching filter options for performance
  diagnosisAvailableFetched: false, // whenever a user returns from a bookmark with diagnosis available in the active filter, there is no label. fetch it once for performance.
  notification: undefined
}
