import { covid19NetworkFacetName } from '../store/helpers/covid19Helper'
import { covid19NetworkFilterOptions, genericFilterOptions } from './filterOptions'

const filterDefinitions = (state) => [
  {
    headerClass: 'bg-warning text-white',
    component: 'CheckboxFilter',
    name: covid19NetworkFacetName,
    label: 'COVID-19',
    options: covid19NetworkFilterOptions,
    initiallyCollapsed: !state.route.query.covid19network,
    filters: state.covid19network.filters
  },
  {
    headerClass: 'bg-warning text-white',
    component: 'CheckboxFilter',
    name: 'covid19',
    label: 'COVID-19 Services',
    options: genericFilterOptions('eu_bbmri_eric_COVID_19'),
    initiallyCollapsed: !state.route.query.covid19,
    filters: state.covid19.filters,
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
    options: genericFilterOptions('eu_bbmri_eric_material_types'),
    initiallyCollapsed: !state.route.query.materials,
    filters: state.materials.filters
  },
  {
    component: 'CheckboxFilter',
    name: 'country',
    label: 'Countries',
    options: genericFilterOptions('eu_bbmri_eric_countries'),
    initiallyCollapsed: !state.route.query.country,
    filters: state.country.filters
  },
  {
    component: 'CheckboxFilter',
    name: 'biobank_quality',
    label: 'Biobank quality marks',
    options: genericFilterOptions('eu_bbmri_eric_assess_level_bio'),
    initiallyCollapsed: !state.route.query.biobank_quality,
    filters: state.biobank_quality.filters
  },
  {
    component: 'CheckboxFilter',
    name: 'collection_quality',
    label: 'Collection quality marks',
    options: genericFilterOptions('eu_bbmri_eric_assess_level_col'),
    initiallyCollapsed: !state.route.query.collection_quality,
    filters: state.collection_quality.filters
  },
  {
    component: 'CheckboxFilter',
    name: 'type',
    label: 'Collection types',
    options: genericFilterOptions('eu_bbmri_eric_collection_types'),
    initiallyCollapsed: !state.route.query.type,
    filters: state.type.filters
  },
  {
    component: 'CheckboxFilter',
    name: 'biobank_network',
    label: 'Biobank network',
    options: genericFilterOptions('eu_bbmri_eric_networks'),
    initiallyCollapsed: !state.route.query.biobank_network,
    filters: state.biobank_network.filters
  },
  {
    component: 'CheckboxFilter',
    name: 'collection_network',
    label: 'Collection network',
    options: genericFilterOptions('eu_bbmri_eric_networks'),
    initiallyCollapsed: !state.route.query.collection_network,
    filters: state.collection_network.filters
  },
  {
    component: 'CheckboxFilter',
    name: 'dataType',
    label: 'Data types',
    options: genericFilterOptions('eu_bbmri_eric_data_types'),
    initiallyCollapsed: !state.route.query.dataType,
    filters: state.dataType.filters
  }
]

export default filterDefinitions
