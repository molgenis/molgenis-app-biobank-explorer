import initialBiobankColumns from './initialBiobankColumns'
import initialCollectionColumns from './initialCollectionColumns'
import initialFilterFacets from './initialFilterFacets'
import i18n from './i18n.js'

export const bbmriConfig = () => {
  const INITIAL_STATE = window.__INITIAL_STATE__ || {}

  const config = {
    negotiatorType: 'eric-negotiator',
    collectionColumns: initialCollectionColumns,
    biobankColumns: initialBiobankColumns,
    filterFacets: initialFilterFacets,
    filterMenuInitiallyFolded: false,
    removeFreemarkerMargin: false,
    biobankCardShowCollections: true,
    menuHeight: 50,
    i18n
  }

  for (const key of Object.keys(INITIAL_STATE)) {
    const configEntry = INITIAL_STATE[key]

    // 0 is not false in this case.
    if (configEntry !== 0 && !configEntry) continue
    else if (Array.isArray(configEntry) && !configEntry.length) continue
    else config[key] = configEntry
  }

  if (Object.hasOwnProperty.call(INITIAL_STATE, 'applicationNotification')) {
    config.applicationNotification = INITIAL_STATE.applicationNotification
  }

  return config
}
