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
    showFacet: true
  },
  {
    name: 'type',
    label: 'Collection types',
    tableName: 'eu_bbmri_eric_collection_types',
    columnName: 'type',
    humanReadableString: 'Collection type(s):',
    showFacet: true
  },
  {
    name: 'commercial_use',
    label: 'Collaboration type',
    columnName: 'collaboration_type',
    humanReadableString: 'Biobank collaboration type(s):',
    showFacet: true
  },
  {
    component: 'CovidNetworkFilter',
    name: 'covid19network',
    label: 'COVID-19',
    custom: true,
    showFacet: false
  },
  {
    name: 'biobank_capabilities',
    label: 'Biobank Capabilities',
    tableName: 'eu_bbmri_eric_capabilities',
    columnName: 'capabilities',
    humanReadableString: 'Biobank capabilities:',
    showFacet: false
  },
  {
    name: 'materials',
    label: 'Materials',
    tableName: 'eu_bbmri_eric_material_types',
    columnName: 'materials',
    humanReadableString: 'Material type(s):',
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
    columnName: 'collection_quality',
    humanReadableString: 'Collection quality label(s):',
    showFacet: false
  },
  {
    name: 'network',
    label: 'Network',
    tableName: 'eu_bbmri_eric_networks',
    columnName: 'network',
    humanReadableString: 'Network(s):',
    showFacet: false
  },
  {
    name: 'dataType',
    label: 'Data types',
    tableName: 'eu_bbmri_eric_data_types',
    columnName: 'dataType',
    humanReadableString: 'Data type(s):',
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
