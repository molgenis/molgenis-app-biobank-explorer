<template>
  <div class="d-flex flex-wrap border align-items-center p-2 m-3 w-100 rounded">
    <div>
      <StringFilter name="Search" v-model="search"></StringFilter>
      <label class="text-muted">Search by name, id, acronym</label>
    </div>
    <b-dropdown
      :text="filter.label || filter.name"
      variant="outline-secondary"
      v-for="filter in filters.slice(0, 5)"
      :key="filter.name"
      class="mr-2"
    >
      <div class="bg-white p-2 dropdown-contents">
        <component
          v-if="bookmarkMappedToState"
          :is="filter.component"
          :value="activeFilters[filter.name]"
          v-bind="filter"
          @input="(value) => filterChange(filter.name, value)"
          :returnTypeAsObject="true"
          :bulkOperation="true"
        >
        </component>
      </div>
    </b-dropdown>
  </div>
</template>

<script>
/** Components used for filters */
import CovidFilter from '../filters/CovidFilter'
import CovidNetworkFilter from '../filters/CovidNetworkFilter'
import {
  StringFilter,
  FilterCard,
  CheckboxFilter,
  MultiFilter
} from '@molgenis-ui/components-library'
/** */

import { mapGetters, mapMutations } from 'vuex'

export default {
  components: {
    StringFilter,
    CheckboxFilter,
    MultiFilter,
    FilterCard,
    CovidFilter,
    CovidNetworkFilter
  },
  data () {
    return {
      debounce: undefined
    }
  },
  computed: {
    ...mapGetters([
      'showCountryFacet',
      'activeFilters',
      'filterDefinitions',
      'bookmarkMappedToState'
    ]),
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
          this.UpdateFilter({
            name: 'search',
            value: search,
            router: this.$router
          }) // passing router so we can set bookmark
        }, 500)
      }
    },
    filters () {
      return this.filterDefinitions
        .filter((facet) => {
          // config option showCountryFacet is used to toggle Country facet
          return !(this.showCountryFacet === false && facet.name === 'country')
        })
        .filter((item) => item.component)
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

<style scoped>
::v-deep span {
    white-space: nowrap;
  }
</style>
