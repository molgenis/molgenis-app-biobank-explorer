const filterDefinitions = [
  {
    component: 'MultiFilter',
    name: 'diagnosis_available',
    label: 'Diagnosis available',
    maxVisibleOptions: 100,
    tableName: 'eu_bbmri_eric_disease_types',
    columnName: 'diagnosis_available',
    humanReadableString: 'Disease type(s):',
    showFacet: true
  },
  {
    name: 'country',
    label: 'Countries',
    tableName: 'eu_bbmri_eric_countries',
    columnName: 'country',
    humanReadableString: 'Countries:',
    queryOptions: '?sort=name',
    showFacet: true
  },
  {
    name: 'type',
    label: 'Collection type',
    tableName: 'eu_bbmri_eric_collection_types',
    columnName: 'type',
    humanReadableString: 'Collection type(s):',
    removeOptions: ['other'],
    showFacet: true
  },
  {
    name: 'categories',
    label: 'Categories',
    tableName: 'eu_bbmri_eric_category',
    columnName: 'categories',
    humanReadableString: 'Categories:',
    showFacet: true
  },
  {
    name: 'commercial_use',
    label: 'Collaboration type',
    columnName: 'collaboration_commercial',
    humanReadableString: 'Biobank collaboration type(s):',
    showFacet: true
  },
  {
    name: 'biobank_capabilities',
    label: 'Biobank services',
    tableName: 'eu_bbmri_eric_capabilities',
    columnName: 'capabilities',
    humanReadableString: 'Biobank services:',
    showFacet: false
  },
  {
    name: 'materials',
    label: 'Material type',
    tableName: 'eu_bbmri_eric_material_types',
    columnName: 'materials',
    humanReadableString: 'Material type(s):',
    removeOptions: ['other'],
    showFacet: false
  },
  {
    name: 'biobank_quality',
    label: 'Biobank quality labels',
    tableName: 'eu_bbmri_eric_assess_level_bio',
    columnName: 'biobank_quality',
    humanReadableString: 'Biobank quality label(s):',
    showFacet: false
  },
  {
    name: 'collection_quality',
    label: 'Collection quality labels',
    tableName: 'eu_bbmri_eric_assess_level_col',
    columnName: 'id',
    humanReadableString: 'Collection quality label(s):',
    showFacet: false
  },
  {
    name: 'network',
    label: 'Network',
    tableName: 'eu_bbmri_eric_networks',
    columnName: 'combined_network',
    humanReadableString: 'Network(s):',
    showFacet: false
  },
  {
    name: 'dataType',
    label: 'Data type',
    tableName: 'eu_bbmri_eric_data_types',
    columnName: 'data_categories',
    humanReadableString: 'Data type(s):',
    removeOptions: ['other'],
    showFacet: false
  },
  {
    name: 'search',
    label: 'Search',
    humanReadableString: 'Text search is',
    custom: true,
    builtIn: true // search should not be generated
  }
]

module.exports = filterDefinitions
