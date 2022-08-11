import { genericFilterOptions, diagnosisAvailableFilterOptions, collaborationTypeFilterOptions } from '../utils/filterOptions'

export const filterTemplate = {

  component: 'CheckboxFilter',
  headerClass: '',
  name: '',
  label: 'New filter',
  maxVisibleOptions: 100,
  tableName: '',
  columnName: '',
  filterLabelAttribute: '',
  humanReadableString: '',
  showSatisfyAllSelector: true,
  queryOptions: '',
  removeOptions: [],
  showFacet: true
}

export const createFilters = (state) => {
  const filterFacets = []

  for (const facet of state.filterFacets) {
    filterFacets.push(
      {
        headerClass: facet.headerClass || '',
        component: facet.component || 'CheckboxFilter',
        name: facet.name || facet.columnName, // name is needed for displaying the bookmark as of now. EG commercial_use is a boolean.
        label: facet.facetTitle || facet.label || facet.columnName,
        tableName: facet.tableName,
        columnName: facet.columnName,
        filterLabelAttribute: facet.filterLabelAttribute || '',
        options: getFilterOptions(facet), // uses the removeOptions array
        filters: state.filters.selections[facet.name], // adds the currently active options
        satisfyAll: state.filters.satisfyAll.includes(facet.name),
        initialDisplayItems: facet.initialDisplayItems || 100,
        maxVisibleOptions: facet.maxVisibleOptions || 25,
        showSatisfyAllSelector: facet.showSatisfyAllSelector || true,
        humanReadableString: facet.humanReadableString,
        builtIn: facet.builtIn,
        showFacet: facet.showFacet
      })
  }

  return filterFacets
}

function getFilterOptions (filterFacet) {
  let options

  switch (filterFacet.name) {
    case 'diagnosis_available':
      options = diagnosisAvailableFilterOptions(filterFacet.tableName, filterFacet.columnName)
      break
    case 'commercial_use':
      options = collaborationTypeFilterOptions()
      break
    default:
      options = genericFilterOptions(filterFacet)
  }
  return options
}
