/* istanbul ignore file */

import { covid19NetworkFacetName } from '../store/helpers/covid19Helper'
import { covid19NetworkFilterOptions, genericFilterOptions } from './filterOptions'

const filterDefinitions = (state) => [
  {
    name: 'search',
    label: 'Search',
    type: 'string-filter'
  },
  {
    headerClass: 'bg-warning text-white',
    component: 'CheckboxFilter',
    name: covid19NetworkFacetName,
    label: 'COVID-19',
    type: 'checkbox-filter',
    options: covid19NetworkFilterOptions,
    initiallyCollapsed: !state.route.query.covid19network,
    filters: state.filters.selections.covid19network
  },
  {
    headerClass: 'bg-warning text-white',
    component: 'CheckboxFilter',
    name: 'covid19',
    label: 'COVID-19 Services',
    type: 'checkbox-filter',
    options: genericFilterOptions('eu_bbmri_eric_COVID_19'),
    initiallyCollapsed: !state.route.query.covid19,
    filters: state.filters.selections.covid19,
    all: true
  },
  {
    component: 'diagnosis-available-filters',
    name: 'diagnosis_available',
    label: 'Diagnosis available',
    initiallyCollapsed: false
  },
  {
    component: 'CheckboxFilter',
    name: 'materials',
    label: 'Materials',
    type: 'checkbox-filter',
    options: genericFilterOptions('eu_bbmri_eric_material_types'),
    initiallyCollapsed: !state.route.query.materials,
    filters: state.filters.selections.materials
  },
  {
    component: 'CheckboxFilter',
    name: 'country',
    label: 'Countries',
    type: 'checkbox-filter',
    options: genericFilterOptions('eu_bbmri_eric_countries'),
    initiallyCollapsed: !state.route.query.country,
    filters: state.filters.selections.country
  },
  {
    component: 'CheckboxFilter',
    name: 'biobank_quality',
    label: 'Biobank quality marks',
    type: 'checkbox-filter',
    options: genericFilterOptions('eu_bbmri_eric_assess_level_bio'),
    initiallyCollapsed: !state.route.query.biobank_quality,
    filters: state.filters.selections.biobank_quality
  },
  {
    component: 'CheckboxFilter',
    name: 'collection_quality',
    label: 'Collection quality marks',
    type: 'checkbox-filter',
    options: genericFilterOptions('eu_bbmri_eric_assess_level_col'),
    initiallyCollapsed: !state.route.query.collection_quality,
    filters: state.filters.selections.collection_quality
  },
  {
    component: 'CheckboxFilter',
    name: 'type',
    label: 'Collection types',
    type: 'checkbox-filter',
    options: genericFilterOptions('eu_bbmri_eric_collection_types'),
    initiallyCollapsed: !state.route.query.type,
    filters: state.filters.selections.type
  },
  {
    component: 'CheckboxFilter',
    name: 'biobank_network',
    label: 'Biobank network',
    type: 'checkbox-filter',
    options: genericFilterOptions('eu_bbmri_eric_networks'),
    initiallyCollapsed: !state.route.query.biobank_network,
    filters: state.filters.selections.biobank_network
  },
  {
    component: 'CheckboxFilter',
    name: 'collection_network',
    label: 'Collection network',
    type: 'checkbox-filter',
    options: genericFilterOptions('eu_bbmri_eric_networks'),
    initiallyCollapsed: !state.route.query.collection_network,
    filters: state.filters.selections.collection_network
  },
  {
    component: 'CheckboxFilter',
    name: 'dataType',
    label: 'Data types',
    type: 'checkbox-filter',
    options: genericFilterOptions('eu_bbmri_eric_data_types'),
    initiallyCollapsed: !state.route.query.dataType,
    filters: state.filters.selections.dataType
  }
]

export default filterDefinitions
