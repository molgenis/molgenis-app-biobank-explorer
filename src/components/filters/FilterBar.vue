<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-12 px-0 py-2">
        <b-dropdown
          :variant="filterVariant(filter.label || filter.name)"
          v-for="filter in filters"
          :key="filter.name"
          class="mr-2 mb-1 mt-1">
          <template #button-content>
            <span>{{ filter.label || filter.name }}</span>
            <span
              class="badge badge-light ml-3"
              v-if="filterSelectionCount(filter.name) > 0">
              {{ filterSelectionCount(filter.name) }}</span>
          </template>
          <div class="bg-white p-2 dropdown-contents">
            <component
              :is="filter.component"
              :value="activeFilters[filter.name]"
              v-bind="filter"
              @input="(value) => filterChange(filter.name, value)"
              :returnTypeAsObject="true"
              :bulkOperation="true">
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
import FilterCard from '../filters/containers/FilterCard.vue'
import CheckboxFilter from '../filters/CheckboxFilter.vue'
import MultiFilter from '../filters/MultiFilter.vue'
/** */

import { mapGetters, mapMutations } from 'vuex'

export default {
  components: {
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
      'getFilters'
    ]),
    filters () {
      return this.getFilters.filter((facet) => facet.component)
    }
  },
  methods: {
    ...mapMutations(['UpdateFilterSelection']),
    filterChange (name, value) {
      this.UpdateFilterSelection({ name, value })
    },
    filterVariant (filterName) {
      if (filterName.toLowerCase().includes('covid')) {
        return 'warning'
      }

      return 'secondary'
    },
    filterSelectionCount (filterName) {
      const filtersActive = this.activeFilters[filterName]
      if (!filtersActive) {
        return 0
      } else {
        return filtersActive.length
      }
    }
  }
}
</script>

<style scoped>
::v-deep span {
  white-space: nowrap;
}
</style>
