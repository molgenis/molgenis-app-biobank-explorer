import initialCollectionColumns from './initialCollectionColumns'

const INITIAL_STATE = window.__INITIAL_STATE__ || {}

export const bbmriConfig = () => {
  const config = {
    disabledFilters: [],
    collectionColumns: initialCollectionColumns,
    customCollectionFilterFacets: []
  }

  // check if property is in database and has a value
  if (Object.hasOwnProperty.call(INITIAL_STATE, 'disabledFilters') && INITIAL_STATE.disabledFilters.length) {
    config.disabledFilters = INITIAL_STATE.disabledFilters
  }

  if (Object.hasOwnProperty.call(INITIAL_STATE, 'collectionColumns') && INITIAL_STATE.collectionColumns.length) {
    config.collectionColumns = INITIAL_STATE.collectionColumns
  }

  if (Object.hasOwnProperty.call(INITIAL_STATE, 'customCollectionFilterFacets') && INITIAL_STATE.customCollectionFilterFacets.length) {
    config.customCollectionFilterFacets = INITIAL_STATE.customCollectionFilterFacets
  }

  return config
}
