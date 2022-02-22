/* istanbul ignore file */
import { genericFilterOptions, diagnosisAvailableFilterOptions, collaborationTypeFilterOptions } from './filterOptions'

const filterDefinitions = (state) => [
  {
    name: 'search',
    label: 'Search',
    type: 'string-filter',
    humanReadableString: 'Text search is'
  },
  {
    headerClass: 'bg-warning text-white',
    component: 'CovidNetworkFilter',
    name: 'covid19network',
    label: 'COVID-19',
    initiallyCollapsed: !state.route.query.collection_network || !state.route.query.network
  },
  {
    headerClass: 'bg-warning text-white',
    component: 'CovidFilter',
    name: 'covid19',
    label: 'COVID-19 Services',
    type: 'checkbox-filter',
    table: 'eu_bbmri_eric_COVID_19',
    options: genericFilterOptions('eu_bbmri_eric_COVID_19', 'covid19'),
    initiallyCollapsed: !state.route.query.covid19,
    filters: state.filters.selections.covid19,
    satisfyAll: state.filters.satisfyAll.includes('covid19'),
    showSatisfyAllCheckbox: true,
    all: true,
    maxVisibleOptions: 25,
    humanReadableString: 'Covid-19 service(s):'
  },
  {
    component: 'MultiFilter',
    name: 'diagnosis_available',
    label: 'Diagnosis available',
    type: 'multi-filter',
    initialDisplayItems: 100,
    maxVisibleOptions: 100,
    table: 'eu_bbmri_eric_disease_types',
    options: diagnosisAvailableFilterOptions('eu_bbmri_eric_disease_types', 'diagnosis_available'),
    satisfyAll: state.filters.satisfyAll.includes('diagnosis_available'),
    showSatisfyAllCheckbox: true,
    initiallyCollapsed: !state.route.query.diagnosis_available,
    humanReadableString: 'Disease type(s):'
  },
  {
    component: 'CheckboxFilter',
    name: 'materials',
    label: 'Materials',
    type: 'checkbox-filter',
    table: 'eu_bbmri_eric_material_types',
    options: genericFilterOptions('eu_bbmri_eric_material_types', 'materials'),
    initiallyCollapsed: !state.route.query.materials,
    filters: state.filters.selections.materials,
    satisfyAll: state.filters.satisfyAll.includes('materials'),
    showSatisfyAllCheckbox: true,
    maxVisibleOptions: 25,
    humanReadableString: 'Material type(s):'
  },
  {
    component: 'CheckboxFilter',
    name: 'country',
    label: 'Countries',
    type: 'checkbox-filter',
    table: 'eu_bbmri_eric_countries',
    options: genericFilterOptions('eu_bbmri_eric_countries', 'country'),
    initiallyCollapsed: !state.route.query.country,
    filters: state.filters.selections.country,
    maxVisibleOptions: 25,
    humanReadableString: 'Countries:'
  },
  {
    component: 'CheckboxFilter',
    name: 'biobank_quality',
    label: 'Biobank quality marks',
    type: 'checkbox-filter',
    table: 'eu_bbmri_eric_assess_level_bio',
    options: genericFilterOptions('eu_bbmri_eric_assess_level_bio', 'biobank_quality'),
    initiallyCollapsed: !state.route.query.biobank_quality,
    filters: state.filters.selections.biobank_quality,
    satisfyAll: state.filters.satisfyAll.includes('biobank_quality'),
    showSatisfyAllCheckbox: true,
    maxVisibleOptions: 25,
    humanReadableString: 'Biobank quality mark(s):'
  },
  {
    component: 'CheckboxFilter',
    name: 'collection_quality',
    label: 'Collection quality marks',
    type: 'checkbox-filter',
    table: 'eu_bbmri_eric_assess_level_col',
    options: genericFilterOptions('eu_bbmri_eric_assess_level_col', 'collection_quality'),
    initiallyCollapsed: !state.route.query.collection_quality,
    filters: state.filters.selections.collection_quality,
    satisfyAll: state.filters.satisfyAll.includes('collection_quality'),
    showSatisfyAllCheckbox: true,
    maxVisibleOptions: 25,
    humanReadableString: 'Collection quality mark(s):'
  },
  {
    component: 'CheckboxFilter',
    name: 'type',
    label: 'Collection types',
    type: 'checkbox-filter',
    table: 'eu_bbmri_eric_collection_types',
    options: genericFilterOptions('eu_bbmri_eric_collection_types', 'type'),
    initiallyCollapsed: !state.route.query.type,
    filters: state.filters.selections.type,
    satisfyAll: state.filters.satisfyAll.includes('type'),
    showSatisfyAllCheckbox: true,
    maxVisibleOptions: 25,
    humanReadableString: 'Collection type(s):'
  },
  {
    component: 'CheckboxFilter',
    name: 'commercial_use',
    label: 'Collaboration type',
    type: 'checkbox-filter',
    options: collaborationTypeFilterOptions(),
    initiallyCollapsed: !state.route.query.collaboration_type,
    filters: state.filters.selections.collaboration_type,
    maxVisibleOptions: 25,
    humanReadableString: 'Biobank collaboration type(s):'
  },
  {
    component: 'CheckboxFilter',
    name: 'network',
    label: 'Network',
    type: 'checkbox-filter',
    table: 'eu_bbmri_eric_networks',
    options: genericFilterOptions('eu_bbmri_eric_networks', 'network'),
    initiallyCollapsed: !state.route.query.network,
    filters: state.filters.selections.network,
    satisfyAll: state.filters.satisfyAll.includes('network'),
    showSatisfyAllCheckbox: true,
    maxVisibleOptions: 25,
    humanReadableString: 'Network(s):'
  },
  {
    component: 'CheckboxFilter',
    name: 'dataType',
    label: 'Data types',
    type: 'checkbox-filter',
    table: 'eu_bbmri_eric_data_types',
    options: genericFilterOptions('eu_bbmri_eric_data_types', 'dataType'),
    initiallyCollapsed: !state.route.query.dataType,
    filters: state.filters.selections.dataType,
    satisfyAll: state.filters.satisfyAll.includes('dataType'),
    showSatisfyAllCheckbox: true,
    maxVisibleOptions: 25,
    humanReadableString: 'Data type(s):'
  }
]

export default filterDefinitions
