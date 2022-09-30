import { bbmriConfig } from '../../config/configManager'

const config = bbmriConfig()

export const configurationState = {
  i18n: config.i18n,
  removeFreemarkerMargin: config.removeFreemarkerMargin,
  biobankCardShowCollections: config.biobankCardShowCollections,
  filterMenuInitiallyFolded: config.filterMenuInitiallyFolded,
  biobankColumns: config.biobankColumns,
  collectionColumns: config.collectionColumns,
  filterFacets: config.filterFacets,
  applicationNotification: config.applicationNotification || '',
  isPodium: config.negotiatorType === 'podium',
  negotiatorCollectionEntityId: config.negotiatorCollectionEntityId || 'eu_bbmri_eric_collections',
  menuHeight: config.menuHeight // standard menu height in pixels for use in sticky-position
}
