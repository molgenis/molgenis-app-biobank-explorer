<template>
  <div class="mx-1" v-if="notEmpty">
    <div class="d-flex align-items-center flex-wrap">
      <label class="font-weight-bold mr-1">Because you searched for:</label>
      <span
        class="badge badge-info mb-1 mr-1"
        v-for="match in matches"
        :key="match.name">
        {{ match.value.join(", ") }}
      </span>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
  props: {
    viewmodel: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters(['activeFilters']),
    ...mapState(['filterFacets', 'filterOptionDictionary']),
    filterInfoDictionary () {
      const filterInfoDictionary = {}

      this.filterFacets.forEach(filter => {
        filterInfoDictionary[filter.name] = {
          column: filter.columnName,
          label: filter.label
        }
      })
      return filterInfoDictionary
    },
    matches () {
      const matches = []
      const filterNames = Object.keys(this.activeFilters)
      for (const filterName of filterNames) {
        const activeFilterValues = this.activeFilters[filterName]
        if (!activeFilterValues) {
          continue
        } /** no need to check further if there are no active filters */

        const filterColumn = this.filterInfoDictionary[filterName].column
        const filterLabel = this.filterInfoDictionary[filterName].label
        const potentialMatch = this.viewmodel[filterColumn]

        if (!potentialMatch) {
          continue
        }

        const isArray = Array.isArray(potentialMatch)
        const match = { name: filterLabel, value: [] }

        for (const activeFilterValue of activeFilterValues) {
          /** need to find the correct filter value instead of the name */
          if (!this.filterOptionDictionary[filterName]) {
            continue /** if the filteroption does not exist */
          }

          const filterOption = this.filterOptionDictionary[filterName].find(
            fo => fo.value === activeFilterValue
          )

          if (!filterOption) continue

          const filterValue = filterOption.value

          if (
            (isArray &&
              potentialMatch.some(
                item => item.id === filterValue
              )) /** if the value is an array */ ||
            (typeof potentialMatch === 'object' &&
              filterValue === potentialMatch.id) /** if value is an object */ ||
              filterValue.toString() === potentialMatch.toString()/** if it is a single value */
          ) {
            match.value.push(filterOption.text)
          }
        }

        if (match.value.length > 0) {
          matches.push(match)
        }
      }

      return matches
    },
    notEmpty () {
      return this.matches.length > 0
    }
  }
}
</script>
