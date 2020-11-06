<template>
  <ActiveFilters
    :value="getActiveFilters"
    @input="changeAllFilters"
    :filters="filters">
  </ActiveFilters>
</template>

<script>
import { createBookmark } from '../../utils/bookmarkMapper'
import { mapGetters, mapMutations } from 'vuex'
import { ActiveFilters } from '@molgenis-ui/components-library'
import filterDefinitions from '../../utils/filterDefinitions'

export default {
  components: { ActiveFilters },
  name: 'active-filter-list',
  methods: {
    ...mapMutations(['UpdateAllFilters']),
    changeAllFilters (value) {
      this.UpdateAllFilters(value)
      createBookmark(this.$router, value)
    },
    resetAllFilters () {
      // TODO: add 'reset all filters' to component library
      this.$store.commit('ResetFilters')
      this.$store.commit('SetSearch', '')
      this.$router.push({ query: {} })
    }
  },
  computed: {
    ...mapGetters(['getActiveFilters']),
    filters () {
      return filterDefinitions(this.$store.state).filter((facet) => {
        // config option showCountryFacet is used to toggle Country facet
        return !(this.showCountryFacet === false && facet.name === 'country')
      })
    }
  }
}
</script>
