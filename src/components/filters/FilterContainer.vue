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
      :collapsed="filter.initiallyCollapsed">
      <component
        :is="filter.component"
        :value="activeFilters[filter.name]"
        :satisfyAllValue="filter.satisfyAll"
        v-bind="filter"
        @input="(value) => filterChange(filter.name, value)"
        @satisfy-all="(satisfyAllValue) => filterSatisfyAllChange(filter.name, satisfyAllValue)"
        :returnTypeAsObject="true"
        :bulkOperation="true">
      </component>
    </FilterCard>
  </div>
</template>

<script>
/** Components used for filters */
import CovidFilter from '../filters/CovidFilter'
import CovidNetworkFilter from '../filters/CovidNetworkFilter'
import { StringFilter, FilterCard, CheckboxFilter, MultiFilter } from '@molgenis-ui/components-library'
/** */

import { mapGetters, mapMutations, mapState } from 'vuex'

export default {
  components: { StringFilter, CheckboxFilter, MultiFilter, FilterCard, CovidFilter, CovidNetworkFilter },
  data () {
    return {
      debounce: undefined
    }
  },
  computed: {
    ...mapState(['disabledFilters']),
    ...mapGetters(['activeFilters', 'getFilters']),
    search: {
      get () {
        return this.activeFilters.search
      },
      set (search) {
        if (this.debounce) {
          clearTimeout(this.debounce)
        }

        this.debounce = setTimeout(async () => {
          clearTimeout(this.debounce)
          this.UpdateFilterSelection({ name: 'search', value: search })
        }, 500)
      }
    },
    filters () {
      return this.getFilters.filter((facet) => facet.component)
    }
  },
  methods: {
    ...mapMutations(['UpdateFilterSelection', 'UpdateFilterSatisfyAll']),
    filterChange (name, value) {
      this.UpdateFilterSelection({ name, value })
    },
    filterSatisfyAllChange (name, value) {
      this.UpdateFilterSatisfyAll({ name, value })
    }
  }
}
</script>

<style scoped>
/* Fix checkbox focus outline being cut-off */
::v-deep #diagnosis_available > .card-body {
  padding: 0.5rem;
}

::v-deep #diagnosis_available > .custom-control {
  padding-left: 1.7rem;
}
</style>
