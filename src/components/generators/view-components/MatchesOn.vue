<template>
  <div class="d-flex align-items-center ml-1" v-if="notEmpty">
    <label class="mr-2 mb-0 font-weight-bold">Matches on:</label>

    <span class="badge badge-info mr-2" v-for="match in matches" :key="match.name">
      {{match.name}}:
      {{match.value.join(', ')}}
      </span>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
  props: {
    viewmodel: {
      type: Object,
      required: false,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters(['activeFilters']),
    ...mapState(['filterFacets', 'filterOptionDictionary']),
    filterColumnDictionary () {
      const filterColumnDictionary = {}
      this.filterFacets.forEach(filter => {
        filterColumnDictionary[filter.name] = filter.columnName
      })

      return filterColumnDictionary
    },
    matches () {
      const matches = []
      const filterNames = Object.keys(this.activeFilters)

      for (const filterName of filterNames) {
        const activeFilterValues = this.activeFilters[filterName]
        if (!activeFilterValues) continue /** no need to check further if there are no active filters */

        const columnName = this.filterColumnDictionary[filterName]
        const potentialMatch = this.viewmodel.attributes.find(attr => attr.column === columnName)
        if (!potentialMatch) continue /** no need to check further if there is no such attribute */

        const isArray = Array.isArray(potentialMatch.value)

        const match = { name: filterName, value: [] }

        for (const activeFilterValue of activeFilterValues) {
          /** need to find the correct filter value instead of the name */
          const filterOption = this.filterOptionDictionary[filterName].find(fo => fo.value === activeFilterValue)
          if (!filterOption) continue /** if the filteroption does not exist */

          const filterValue = filterOption.text

          if ((isArray && potentialMatch.value.some(value => value === filterValue)) || filterValue === potentialMatch.value) {
            match.value.push(filterValue)
          }
        }

        if (match.value.length > 0) {
          matches.push(match)
        }
      }

      return matches
    },
    notEmpty () {
      return Object.keys(this.viewmodel).length > 0
    }
  }
}
</script>
