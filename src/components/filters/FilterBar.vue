<template>
  <div class="container-fluid">
    <div class="row">
      <b-button
        v-b-toggle.filters
        variant="outline-info"
        @click="filtersCollapsed = !filtersCollapsed">
        <font-awesome-icon
          icon="caret-right"
          :style="iconStyle"
          class="collapse-button mr-2"/>
        <span>Filters</span>

        <span
          class="badge badge-info ml-2"
          v-if="Object.keys(activeFilters) && Object.keys(activeFilters).length > 0">
          {{ Object.keys(activeFilters).length }}</span>
      </b-button>
      <b-collapse id="filters" class="mt-2">
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
          <b-button variant="outline-secondary" @click="ClearActiveFilters">Clear all filters</b-button>
        </div>
      </b-collapse>
    </div>
  </div>
</template>

<script>
/** Components used for filters */
import CovidFilter from '../filters/CovidFilter.vue'
import CovidNetworkFilter from '../filters/CovidNetworkFilter.vue'
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
      filterBarShown: false,
      filtersCollapsed: false
    }
  },
  computed: {
    ...mapGetters(['showCountryFacet', 'activeFilters', 'getFilters']),
    filters () {
      return this.getFilters.filter(facet => facet.component)
    },
    iconStyle () {
      return {
        transform: `rotate(${!this.filtersCollapsed ? 0 : 90}deg)`,
        transition: 'transform 0.2s'
      }
    }
  },
  methods: {
    ...mapMutations(['UpdateFilterSelection', 'ClearActiveFilters']),
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
