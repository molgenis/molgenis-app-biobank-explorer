<template>
  <div class="container-fluid">
    <div class="row mb-3">
      <div class="col-md-4 pl-0">
        <StringFilter
          name="Search"
          v-model="search"
          placeholder="Search by name, id, acronym"
        ></StringFilter>
      </div>
      <div class="col-md-4"></div>
      <div class="col-md-4 d-flex align-items-center pr-0">
        <button
          class="btn btn-info ml-auto"
          @click="filterBarShown = !filterBarShown"
        >
          Filter menu
          <span
            class="fa"
            :class="[
              { 'fa-caret-down': !filterBarShown },
              { 'fa-caret-up': filterBarShown },
            ]"
          ></span>
        </button>
      </div>
    </div>
    <div
      v-if="filterBarShown"
      class="row border-top border-bottom border-secondary"
    >
      <div class="col-md-12 px-0 py-2">
        <b-dropdown
          :text="filter.label || filter.name"
          :variant="filterVariant(filter.label || filter.name)"
          v-for="filter in filters"
          :key="filter.name"
          class="mr-2 mb-1 mt-1"
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
    </div>
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
      debounce: undefined,
      filterBarShown: false
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
    },
    filterVariant (filterName) {
      if (filterName.toLowerCase().includes('covid')) {
        return 'warning'
      }

      return 'secondary'
    }
  }
}
</script>

<style scoped>
::v-deep span {
  white-space: nowrap;
}
</style>
