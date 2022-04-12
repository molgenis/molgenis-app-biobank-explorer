import initialBiobankColumns from './initialBiobankColumns'
import initialCollectionColumns from './initialCollectionColumns'
import initialFilterFacets from './initialFilterFacets'

export const bbmriConfig = () => {
  const INITIAL_STATE = window.__INITIAL_STATE__ || {}

  const config = {
    collectionColumns: initialCollectionColumns,
    biobankColumns: initialBiobankColumns,
    filterFacets: initialFilterFacets,
    removeFreemarkerMargin: false,
    menuHeight: 50
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

  return config
}
