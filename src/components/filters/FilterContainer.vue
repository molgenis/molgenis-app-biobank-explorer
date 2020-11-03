<template>
  <div id="filter-container">
    <FilterCard name="search" label="Search" description="Search by name, id, acronym" :collapsed="!this.$store.state.route.query.search">
      <StringFilter name="Search" v-model="search"> </StringFilter>
    </FilterCard>

    <FilterCard
      v-for="filter in filters"
      :key="filter.name"
      :name="filter.name"
      :label="filter.label"
      :collapsed="filter.initiallyCollapsed"
    >
      <component
        :is="filter.component"
        :value="$store.state.filters.selections[filter.name]"
        v-bind="filter"
        @input="(value) => filterChange(filter.name, value)"
        :maxVisibleOptions="25"
        :bulkOperation="true"
      >
      </component>
    </FilterCard>
  </div>
</template>

<style>
.filter-card {
  margin-bottom: 1rem;
}

.filter-header {
  /* Same color as BiobankCard */
  background-color: #f5f5f5;
}

.filter-header:hover {
  cursor: pointer;
}
</style>

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
    ...mapGetters({
      showCountryFacet: 'showCountryFacet',
      covid19Options: 'getCovid19Options',
      covid19NetworkOptions: 'getCovid19NetworkOptions'
    }),
    search: {
      get () {
        return this.$store.state.search
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
          this.SetSearch(search || '')
        }, 500)
      }
    },
    filters () {
      return filterDefinitions(this.$store.state).filter((facet) => {
        // config option showCountryFacet is used to toggle Country facet
        return !(this.showCountryFacet === false && facet.name === 'country')
      })
    }
  },
  methods: {
    ...mapMutations(['UpdateFilter', 'SetSearch']),
    filterChange (name, filters) {
      this.UpdateFilter({ name, filters })
      const value = filters.length === 0 ? undefined : filters.join(',')
      this.$router.push({
        query: { ...this.$store.state.route.query, [name]: value }
      })
      if (name === 'collection_quality') {
        this.$store.dispatch('GetCollectionQualityCollections')
      }
      if (name === 'biobank_quality') {
        this.$store.dispatch('GetBiobankQualityBiobanks')
      }
    }
  },
  mounted () {
    this.$store.dispatch('GetCovid19Options')
  }
}
</script>
