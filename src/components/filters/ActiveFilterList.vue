<template>
  <ActiveFilters
    :key="activeFilterKey"
    :value="activeFilters"
    @input="changeAllFilters"
    :filters="getFilters">
  </ActiveFilters>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'
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
    ...mapState(['disabledFilters']),
    ...mapGetters(['activeFilters', 'getFilters', 'selectedCollections', 'getCustomCheckboxFilters']),
    activeFilterKey () {
      // Create a base64 representation of the active filters as key, so it forces re-render on change
      return btoa(JSON.stringify(this.activeFilters))
    }
  }
}
</script>
