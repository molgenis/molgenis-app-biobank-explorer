<template>
  <!-- using container for bootstrap's max-width -->
  <div class="container p-3 header-bar card">
    <div class="row">
      <b-collapse id="filters" visible>
        <div class="col-12">
          <div class="w-25 search-container mr-2">
            <search-filter />
          </div>
          <b-dropdown
            :variant="filterVariant(filter.label || filter.name)"
            v-for="filter in filters"
            :key="filter.name"
            boundary="window"
            no-flip
            class="mr-2 mb-1 mt-1 filter-dropdown">
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
                @satisfy-all="(satisfyAllValue) => filterSatisfyAllChange(filter.name, satisfyAllValue)"
                :returnTypeAsObject="true"
                :bulkOperation="true">
              </component>
            </div>
          </b-dropdown>
          <b-button variant="outline-secondary" @click="ClearActiveFilters">Clear all filters</b-button>
        </div>
      </b-collapse>
    </div>

    <div class="row my-2">
      <div class="col">
        <b-button
          class="mt-2"
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
            v-if="
              Object.keys(activeFilters) &&
              Object.keys(activeFilters).length > 0
            ">
            {{ Object.keys(activeFilters).length }}</span>
        </b-button>
      </div>
      <div class="col">
        <pagination />
      </div>
      <div aria-label="action-bar" class="col text-right">
        <collection-select-all
          v-if="!loading && foundCollectionIds.length"
          bookmark/>
      </div>
    </div>

    <result-header v-if="!loading" />
  </div>
</template>

<script>
import CollectionSelectAll from './buttons/CollectionSelectAll.vue'
import Pagination from './buttons/Pagination.vue'
import { mapGetters, mapMutations } from 'vuex'
import ResultHeader from './ResultHeader.vue'

/** Components used for filters */
import SearchFilter from './filters/SearchFilter.vue'
import CovidFilter from './filters/CovidFilter.vue'
import CovidNetworkFilter from './filters/CovidNetworkFilter.vue'
import CheckboxFilter from './filters/CheckboxFilter.vue'
import MultiFilter from './filters/MultiFilter.vue'
/** */

export default {
  components: {
    CollectionSelectAll,
    Pagination,
    ResultHeader,
    SearchFilter,
    CheckboxFilter,
    MultiFilter,
    CovidFilter,
    CovidNetworkFilter
  },
  computed: {
    ...mapGetters([
      'loading',
      'foundCollectionIds',
      'activeFilters',
      'getFilters'
    ]),
    filters () {
      return this.getFilters.filter(facet => facet.component)
    },
    iconStyle () {
      return {
        transform: `rotate(${this.filtersCollapsed ? 0 : -90}deg)`,
        transition: 'transform 0.2s'
      }
    }
  },
  data () {
    return {
      debounce: undefined,
      filterBarShown: false,
      filtersCollapsed: false
    }
  },
  methods: {
    ...mapMutations(['UpdateFilterSelection', 'ClearActiveFilters', 'UpdateFilterSatisfyAll']),
    filterChange (name, value) {
      this.UpdateFilterSelection({ name, value })
    },
    filterSatisfyAllChange (name, value) {
      this.UpdateFilterSatisfyAll({ name, value })
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

<style>
.header-bar {
  background-color: white;
}
::v-deep span {
  white-space: nowrap;
}

.dropdown-contents {
  max-width: 50rem;
  overflow: auto;
}

.search-container {
  display: inline-flex;
  position: relative;
  top: 2px; /* aligning it with the dropwdowns */
}
</style>
