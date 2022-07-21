import initialBiobankColumns from './initialBiobankColumns'
import initialCollectionColumns from './initialCollectionColumns'
import initialFilterFacets from './initialFilterFacets'
import i18n from './i18n.js'

export const bbmriConfig = () => {
  const INITIAL_STATE = window.__INITIAL_STATE__ || {}

  const config = {
    collectionColumns: initialCollectionColumns,
    biobankColumns: initialBiobankColumns,
    filterFacets: initialFilterFacets,
    filterMenuInitiallyFolded: false,
    removeFreemarkerMargin: false,
    biobankCardShowCollections: true,
    menuHeight: 50,
    i18n
  }

  if (Object.hasOwnProperty.call(INITIAL_STATE, 'collectionColumns') && INITIAL_STATE.collectionColumns.length) {
    config.collectionColumns = INITIAL_STATE.collectionColumns
  }

  if (Object.hasOwnProperty.call(INITIAL_STATE, 'biobankColumns') && INITIAL_STATE.biobankColumns.length) {
    config.biobankColumns = INITIAL_STATE.biobankColumns
  }

  if (Object.hasOwnProperty.call(INITIAL_STATE, 'filterFacets') && INITIAL_STATE.filterFacets.length) {
    config.filterFacets = INITIAL_STATE.filterFacets
  }

  if (Object.hasOwnProperty.call(INITIAL_STATE, 'removeFreemarkerMargin') && INITIAL_STATE.removeFreemarkerMargin === true) {
    config.removeFreemarkerMargin = INITIAL_STATE.removeFreemarkerMargin
  }

  if (Object.hasOwnProperty.call(INITIAL_STATE, 'menuHeight') && typeof INITIAL_STATE.menuHeight === 'number') {
    config.menuHeight = INITIAL_STATE.menuHeight
  }

  if (Object.hasOwnProperty.call(INITIAL_STATE, 'biobankCardShowCollections') && typeof INITIAL_STATE.biobankCardShowCollections === 'boolean') {
    config.biobankCardShowCollections = INITIAL_STATE.biobankCardShowCollections
  }

  if (Object.hasOwnProperty.call(INITIAL_STATE, 'i18n') && Object.keys(INITIAL_STATE.i18n)) {
    config.i18n = INITIAL_STATE.i18n
  }

  if (Object.hasOwnProperty.call(INITIAL_STATE, 'filterMenuInitiallyFolded')) {
    config.filterMenuInitiallyFolded = INITIAL_STATE.filterMenuInitiallyFolded
  }

  if (Object.hasOwnProperty.call(INITIAL_STATE, 'applicationNotification')) {
    config.applicationNotification = INITIAL_STATE.applicationNotification
  }

  return config
}
