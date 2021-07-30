<template>
  <ActiveFilters
    :key="activeFilterKey"
    :value="activeFilters"
    @input="changeAllFilters"
    :filters="filters">
  </ActiveFilters>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { ActiveFilters } from '@molgenis-ui/components-library'

export default {
  components: { ActiveFilters },
  name: 'active-filter-list',
  methods: {
    ...mapMutations(['UpdateFilterSelection']),
    changeAllFilters (newActiveFilters) {
      for (const prevActiveFilter in this.activeFilters) {
        if (!Object.prototype.hasOwnProperty.call(newActiveFilters, prevActiveFilter)) {
          // add the active filter as empty, so it will be picked up by filter update as delete
          newActiveFilters[prevActiveFilter] = ''
        }
      }
      this.UpdateFilterSelection(newActiveFilters)
    }
  },
  computed: {
    ...mapGetters(['activeFilters', 'getFilterDefinitions', 'selectedCollections']),
    activeFilterKey () {
      // Create a base64 representation of the active filters as key, so it forces re-render on change
      return btoa(JSON.stringify(this.activeFilters))
    },
    filters () {
      return this.getFilterDefinitions.filter((facet) => {
        // config option showCountryFacet is used to toggle Country facet
        return !(this.showCountryFacet === false && facet.name === 'country')
      })
    }
  }
}
</script>
