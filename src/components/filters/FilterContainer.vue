<template>
  <div id="filter-container">
    <FilterCard name="search" label="Search" description="Search by name, id, acronym" :collapsed="!this.$store.state.route.query.search">
      <StringFilter name="Search" v-model="search"></StringFilter>
    </FilterCard>
    <FilterCard
      v-for="filter in filters"
      :key="filter.name"
      :name="filter.name"
      :label="filter.label"
      :headerClass="filter.headerClass"
      :collapsed="filter.initiallyCollapsed"
    >
      <component
        :is="filter.component"
        :value="getActiveFilters[filter.name]"
        v-bind="filter"
        @input="(value) => filterChange(filter.name, value)"
        :returnObject="true"
        :bulkOperation="true"
      >
      </component>
    </FilterCard>
  </div>
</template>

<script>
/** Components used for filters */
import { StringFilter, FilterCard, CheckboxFilter, MultiFilter } from '@molgenis-ui/components-library'
/** */

import { mapGetters, mapMutations } from 'vuex'

export default {
  components: { StringFilter, CheckboxFilter, MultiFilter, FilterCard },
  data () {
    return {
      debounce: undefined
    }
  },
  computed: {
    ...mapGetters(['showCountryFacet', 'getActiveFilters', 'filterDefinitions']),
    search: {
      get () {
        return this.getActiveFilters.search
      },
      set (search) {
        if (this.debounce) {
          clearTimeout(this.debounce)
        }

        this.debounce = setTimeout(async () => {
          clearTimeout(this.debounce)
          this.UpdateFilter({ name: 'search', value: search, router: this.$router }) // passing router so we can set bookmark
        }, 500)
      }
    },
    filters () {
      return this.filterDefinitions.filter((facet) => {
        // config option showCountryFacet is used to toggle Country facet
        return !(this.showCountryFacet === false && facet.name === 'country')
      }).filter((item) => item.component)
    }
  },
  methods: {
    ...mapMutations(['UpdateFilter']),
    filterChange (name, value) {
      this.UpdateFilter({ name, value, router: this.$router })
    }
  }
}
</script>
