import initialBiobankColumns from './initialBiobankColumns'
import initialCollectionColumns from './initialCollectionColumns'

export const bbmriConfig = () => {
  const INITIAL_STATE = window.__INITIAL_STATE__ || {}

  const config = {
    disabledFilters: [],
    collectionColumns: initialCollectionColumns,
    biobankColumns: initialBiobankColumns,
    customCollectionFilterFacets: [],
    removeFreemarkerMargin: false,
    menuHeight: 50
  }

  // check if property is in database and has a value
  if (Object.hasOwnProperty.call(INITIAL_STATE, 'disabledFilters') && INITIAL_STATE.disabledFilters.length) {
    config.disabledFilters = INITIAL_STATE.disabledFilters
  }

  if (Object.hasOwnProperty.call(INITIAL_STATE, 'collectionColumns') && INITIAL_STATE.collectionColumns.length) {
    config.collectionColumns = INITIAL_STATE.collectionColumns
  }

  if (Object.hasOwnProperty.call(INITIAL_STATE, 'biobankColumns') && INITIAL_STATE.biobankColumns.length) {
    config.biobankColumns = INITIAL_STATE.biobankColumns
  }

  if (Object.hasOwnProperty.call(INITIAL_STATE, 'customCollectionFilterFacets') && INITIAL_STATE.customCollectionFilterFacets.length) {
    config.customCollectionFilterFacets = INITIAL_STATE.customCollectionFilterFacets
  }

  if (Object.hasOwnProperty.call(INITIAL_STATE, 'removeFreemarkerMargin') && INITIAL_STATE.removeFreemarkerMargin === true) {
    config.removeFreemarkerMargin = INITIAL_STATE.removeFreemarkerMargin
  }

  if (Object.hasOwnProperty.call(INITIAL_STATE, 'menuHeight') && typeof INITIAL_STATE.menuHeight === 'number') {
    config.menuHeight = INITIAL_STATE.menuHeight
  }

  return config
}
