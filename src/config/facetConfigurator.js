import { genericFilterOptions, diagnosisAvailableFilterOptions, collaborationTypeFilterOptions } from '../utils/filterOptions'

export const createFilters = (state) => {
  const filterFacets = []

  for (const facet of state.filterFacets) {
    filterFacets.push(
      {
        headerClass: facet.headerClass || '',
        component: facet.component || 'CheckboxFilter',
        name: facet.columnName || facet.name,
        label: facet.facetTitle || facet.label || facet.columnName,
        tableName: facet.tableName,
        columnName: facet.columnName,
        options: getFilterOptions(facet),
        filters: state.filters.selections[facet.columnName],
        satisfyAll: state.filters.satisfyAll.includes(facet.columnName),
        initialDisplayItems: facet.initialDisplayItems || 100,
        maxVisibleOptions: facet.maxVisibleOptions || 25,
        showSatisfyAllCheckbox: facet.showSatisfyAllCheckbox || true,
        humanReadableString: facet.negotiatorDescription,
        hideFacet: facet.hideFacet,
        custom: facet.custom || false
      })
  }

  return filterFacets
}

function getFilterOptions (filterFacet) {
  let options

  switch (filterFacet.columnName) {
    case 'diagnosis_available':
      options = diagnosisAvailableFilterOptions(filterFacet.tableName, filterFacet.columnName)
      break
    case 'commercial_use':
      options = collaborationTypeFilterOptions()
      break
    default:
      options = genericFilterOptions(filterFacet.tableName, filterFacet.columnName)
  }
  return options
}
