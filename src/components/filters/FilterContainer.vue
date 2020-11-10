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

import { mapActions, mapGetters, mapMutations } from 'vuex'
import filterDefinitions from '../../utils/filterDefinitions'

export default {
  components: { StringFilter, CheckboxFilter, MultiFilter, FilterCard },
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
          this.UpdateFilter({ name: 'search', value: search, router: this.$router }) // passing router so we can set bookmark
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
    ...mapActions(['GetCollectionIdsForQuality', 'GetBiobankIdsForQuality']),
    ...mapMutations(['UpdateFilter', 'SetSearch']),
    filterChange (name, value) {
      console.log(name, value)
      if (name === 'biobank_quality') this.GetBiobankIdsForQuality(value)
      if (name === 'collection_quality') this.GetCollectionIdsForQuality(value)

      this.UpdateFilter({ name, value, router: this.$router })
    }
  }
}
</script>
