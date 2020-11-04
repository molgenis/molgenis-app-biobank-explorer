<template>
  <div id="filter-container">
    <FilterCard name="search" label="Search" description="Search by name, id, acronym" :collapsed="!this.$store.state.route.query.search">
      <StringFilter name="Search" v-model="search"> </StringFilter>
    </FilterCard>
    {{getActiveFilters}}
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
        :maxVisibleOptions="25"
        :bulkOperation="true"
      >
      </component>
    </FilterCard>
  </div>
</template>

<script>
/** Components used for filters */
import { StringFilter, FilterCard, CheckboxFilter } from '@molgenis-ui/components-library'
import DiagnosisAvailableFilters from './DiagnosisAvailableFilters.vue'
/** */
import { mapGetters, mapMutations } from 'vuex'
import filterDefinitions from '../../utils/filterDefinitions'

export default {
  components: { StringFilter, CheckboxFilter, DiagnosisAvailableFilters, FilterCard },
  data () {
    return {
      debounce: undefined
    }
  },
  computed: {
    ...mapGetters(['showCountryFacet', 'getActiveFilters']),
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
          const updatedRouteQuery = Object.assign({}, this.$store.state.route.query, {
            search
          })
          this.$router.push({ query: updatedRouteQuery })
          this.UpdateFilter({ name: 'search', value: search })
        }, 500)
      }
    },
    filters () {
      return filterDefinitions(this.$store.state).filter((facet) => {
        // config option showCountryFacet is used to toggle Country facet
        return !(this.showCountryFacet === false && facet.name === 'country')
      }).filter((item) => item.component)
    }
  },
  methods: {
    ...mapMutations(['UpdateFilter', 'SetSearch']),
    filterChange (name, value) {
      this.UpdateFilter({ name, value })
      const filter = value.length === 0 ? undefined : value.join(',')
      this.$router.push({
        query: { ...this.$store.state.route.query, [name]: filter }
      })
    }
  }
}
</script>
