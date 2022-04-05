<template>
  <div
    class="p-3 mx-3 header-bar card sticky-top border-0 shadow-sm"
    :style="`top:${menuHeight}px;`">
    <div class="row my-2">
      <div class="col-5" aria-label="action-bar">
        <b-button
          class="mr-2 mb-2"
          v-b-toggle.filters
          variant="info"
          @click="filtersCollapsed = !filtersCollapsed">
          <font-awesome-icon
            icon="caret-right"
            :style="iconStyle"
            class="collapse-button mr-2"/>
          <span>Filters</span>

          <span class="badge badge-light ml-2" v-if="numberOfActiveFilters > 0">
            {{ numberOfActiveFilters }}</span>
        </b-button>
        <b-button
          v-if="numberOfActiveFilters > 0"
          class="mr-2 mb-2"
          variant="outline-secondary"
          @click="ClearActiveFilters">Clear all filters</b-button>
        <collection-select-all
          class="d-inline mr-2"
          v-if="!loading && foundCollectionIds.length"
          bookmark/>

        <router-link
          v-if="showSettings"
          class="btn btn-light border mb-2"
          to="/configuration">
          <span class="mr-2">Settings</span>
          <font-awesome-icon icon="cog" />
        </router-link>
      </div>
      <div class="col-4">
        <pagination />
      </div>
      <div class="col text-right">
        <b-button variant="primary" @click="showCart = !showCart"><span>Checkout</span><span class="badge badge-light ml-2">
            {{ selectedCollections.length }}</span></b-button>
      </div>
    </div>
    <div class="row my-2">
      <b-collapse id="filters">
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
                class="badge badge-light border ml-2"
                v-if="filterSelectionCount(filter.name) > 0">
                {{ filterSelectionCount(filter.name) }}</span>
            </template>
            <div class="bg-white p-2 dropdown-contents">
              <component
                :is="filter.component"
                :value="activeFilters[filter.name]"
                v-bind="filter"
                @input="(value) => filterChange(filter.name, value)"
                @satisfy-all="
                  (satisfyAllValue) =>
                    filterSatisfyAllChange(filter.name, satisfyAllValue)
                "
                :returnTypeAsObject="true"
                :bulkOperation="true">
              </component>
            </div>
          </b-dropdown>
        </div>
      </b-collapse>
    </div>

    <result-header v-if="!loading" />
    <negotiator-selection v-model="showCart" />
  </div>
</template>

<script>
import CollectionSelectAll from './buttons/CollectionSelectAll.vue'
import Pagination from './buttons/Pagination.vue'
import { mapGetters, mapMutations, mapState } from 'vuex'
import ResultHeader from './ResultHeader.vue'

/** Components used for filters */
import SearchFilter from './filters/SearchFilter.vue'
import CovidFilter from './filters/CovidFilter.vue'
import CovidNetworkFilter from './filters/CovidNetworkFilter.vue'
import CheckboxFilter from './filters/CheckboxFilter.vue'
import MultiFilter from './filters/MultiFilter.vue'
import NegotiatorSelection from './popovers/NegotiatorSelection.vue'
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
    CovidNetworkFilter,
    NegotiatorSelection
  },
  computed: {
    ...mapGetters([
      'loading',
      'foundCollectionIds',
      'activeFilters',
      'getFilters',
      'selectedCollections'
    ]),
    ...mapState(['menuHeight', 'applicationContext']),
    showSettings () {
      return this.applicationContext.roles
        ? this.applicationContext.roles.includes('ROLE_SU')
        : false
    },
    filters () {
      return this.getFilters.filter(facet => facet.component)
    },
    iconStyle () {
      return {
        transform: `rotate(${this.filtersCollapsed ? 0 : 90}deg)`,
        transition: 'transform 0.2s'
      }
    },
    numberOfActiveFilters () {
      const hasActiveFilters = Object.keys(this.activeFilters)
      return hasActiveFilters ? hasActiveFilters.length : 0
    }
  },
  data () {
    return {
      filterBarShown: false,
      filtersCollapsed: true,
      showCart: false
    }
  },
  methods: {
    ...mapMutations([
      'UpdateFilterSelection',
      'ClearActiveFilters',
      'UpdateFilterSatisfyAll'
    ]),
    filterChange (name, value) {
      this.UpdateFilterSelection({ name, value })
    },
    filterSatisfyAllChange (name, value) {
      this.UpdateFilterSatisfyAll({ name, value })
    },
    filterVariant (filterName) {
      if (filterName.toLowerCase().includes('covid')) {
        return 'outline-warning'
      }

      return 'outline-secondary'
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
  z-index: 1000;
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

<style>
/* Theme override */
#filters .dropdown-toggle {
  padding-right:1.5rem;
}

#filters .filter-dropdown .dropdown-toggle::after {
  content: "";
  position: absolute;
  border-bottom: 0;
  border-left: 0.4rem solid transparent;
  border-left-color: transparent;
  border-left-style: solid;
  border-left-width: 0.4rem;
  border-right: 0.4rem solid transparent;
  border-top: 0.4rem solid;
  content: "";
  display: inline-block;
  margin-left: 0.4rem;
  margin-top: 0.6rem;
}

</style>
