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
    applyTo: ['eu_bbmri_eric_collections', 'eu_bbmri_eric_biobanks'],
    showFacet: true,
    adaptive: true
  },
  {
    name: 'type',
    label: 'Collection type',
    tableName: 'eu_bbmri_eric_collection_types',
    columnName: 'type',
    humanReadableString: 'Collection type(s):',
    queryOptions: '?sort=label',
    removeOptions: ['other'],
    showFacet: true,
    adaptive: true
  },
  {
    name: 'categories',
    label: 'Categories',
    tableName: 'eu_bbmri_eric_category',
    columnName: 'categories',
    humanReadableString: 'Categories:',
    queryOptions: '?sort=label',
    showFacet: true,
    adaptive: true
  },
  {
    name: 'materials',
    label: 'Material type',
    tableName: 'eu_bbmri_eric_material_types',
    columnName: 'materials',
    humanReadableString: 'Material type(s):',
    queryOptions: '?sort=label',
    removeOptions: ['other'],
    showFacet: true,
    adaptive: true
  },
  {
    name: 'commercial_use',
    component: 'ToggleFilter',
    trueOption: {
      text: 'Available to commercial use',
      value: 'true'
    },
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
    queryOptions: '?sort=label',
    applyTo: ['eu_bbmri_eric_biobanks'],
    showFacet: true
  },
  {
    name: 'combined_quality',
    label: 'Quality labels',
    tableName: 'eu_bbmri_eric_assessment_levels',
    columnName: 'combined_quality',
    humanReadableString: 'Quality label(s):',
    queryOptions: '?sort=label',
    showFacet: true
  },
  {
    name: 'network',
    label: 'Network',
    tableName: 'eu_bbmri_eric_networks',
    columnName: 'combined_network',
    humanReadableString: 'Network(s):',
    queryOptions: '?sort=name',
    showFacet: true
  },
  {
    name: 'dataType',
    label: 'Data type',
    tableName: 'eu_bbmri_eric_data_types',
    columnName: 'data_categories',
    humanReadableString: 'Data type(s):',
    queryOptions: '?sort=label',
    removeOptions: ['other', 'not available'],
    showFacet: true
  },
  {
    name: 'search',
    label: 'Search',
    humanReadableString: 'Text search is',
    builtIn: true // search should not be generated
  }
]

module.exports = filterDefinitions
