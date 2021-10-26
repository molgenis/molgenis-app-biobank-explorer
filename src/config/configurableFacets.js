import { genericFilterOptions } from '../utils/filterOptions'

export const customCheckboxFilters = (state) => {
  const customFacets = []

  for (const customFacet of state.customCollectionFilterFacets) {
    customFacets.push(
      {
        component: 'CheckboxFilter',
        name: customFacet.columnName,
        label: customFacet.facetTitle,
        type: 'checkbox-filter',
        table: customFacet.tableName,
        options: genericFilterOptions(customFacet.tableName, customFacet.columnName),
        initiallyCollapsed: !state.route.query[customFacet.columnName],
        filters: state.filters.selections[customFacet.columnName],
        satisfyAll: state.filters.satisfyAll.includes(customFacet.columnName),
        showSatisfyAllCheckbox: true,
        maxVisibleOptions: 25,
        humanReadableString: customFacet.negotiatorDescription,
        insertBefore: customFacet.insertBefore
      })
  }

  return customFacets
}
