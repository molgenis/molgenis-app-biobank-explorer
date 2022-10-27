<template>
  <div
    class="px-3 pt-1 header-bar card sticky-top border-0 shadow-sm"
    :style="`top:${menuHeight}px;`">
    <div class="row my-2">
      <div class="col-8" aria-label="action-bar">
        <div class="search-container mr-2 mb-2">
          <search-filter />
        </div>
        <b-button
          v-if="numberOfActiveFilters > 0"
          class="mr-2"
          variant="outline-danger"
          @click="ClearActiveFilters">Clear all filters</b-button>

        <collection-select-all
          class="d-inline mr-2"
          v-if="
            !loading && foundCollectionIds.length && numberOfActiveFilters > 0
          "
          bookmark/>
      </div>
      <div class="col text-right">
        <router-link
          v-if="showSettings"
          class="btn btn-light border mr-2"
          to="/configuration">
          <span class="mr-2">Settings</span>
          <font-awesome-icon icon="cog" />
        </router-link>
        <b-button variant="primary" @click="showCart = !showCart"><span>{{ uiText["request"] }}</span><span class="badge badge-light ml-2">
            {{ selectedCollections.length }}</span></b-button>
      </div>
    </div>
    <div class="row mb-2">
      <div class="col-12">
        <b-dropdown
          :variant="filterVariant(filter.name)"
          @shown="calculateOptions(filter)"
          @hidden="setInactive(filter)"
          v-for="filter in facetsToRender"
          :key="filter.name"
          boundary="window"
          no-flip
          class="mr-2 mb-1 filter-dropdown">
          <template #button-content>
            <span>{{ filter.label || filter.name }}</span>
            <span
              class="badge badge-light border ml-2"
              v-if="filterSelectionCount(filter.name) > 0">
              {{ filterSelectionCount(filter.name) }}</span>
          </template>
          <div class="bg-white p-2 dropdown-contents">
            <component
              v-if="filterLoading !== filter.name"
              :is="filter.component"
              :value="activeFilters[filter.name]"
              :satisfyAllValue="activeSatisfyAll.includes(filter.name)"
              v-bind="filter"
              @input="(value) => filterChange(filter.name, value)"
              @satisfy-all="
                (satisfyAll) => filterSatisfyAllChange(filter.name, satisfyAll)
              "
              :optionsFilter="filterOptionsOverride[filter.name]"
              :returnTypeAsObject="true"
              :bulkOperation="true">
            </component>
            <div
              class="d-inline-block"
              v-if="filterLoading === filter.name">
                {{ uiText["filter_loading"] }}
                <i class="fa fa-spinner fa-pulse" aria-hidden="true"></i>
            </div>
          </div>
        </b-dropdown>

        <span v-show="showAllFilters">
          <b-dropdown
            :variant="filterVariant(additionalFilter.name)"
            @shown="calculateOptions(additionalFilter)"
            @hidden="setInactive(additionalFilter)"
            v-for="additionalFilter in moreFacets"
            :key="additionalFilter.name"
            boundary="window"
            no-flip
            class="mr-2 mb-1 filter-dropdown">
            <template #button-content>
              <span>{{ additionalFilter.label || additionalFilter.name }}</span>
              <span
                class="badge badge-light border ml-2"
                v-if="filterSelectionCount(additionalFilter.name) > 0">
                {{ filterSelectionCount(additionalFilter.name) }}</span>
            </template>
            <div class="bg-white p-2 dropdown-contents">
              <component
                v-if="filterLoading !== additionalFilter.name"
                :is="additionalFilter.component"
                :value="activeFilters[additionalFilter.name]"
                v-bind="additionalFilter"
                :satisfyAllValue="
                  activeSatisfyAll.includes(additionalFilter.name)
                "
                @input="(value) => filterChange(additionalFilter.name, value)"
                @satisfy-all="
                  (satisfyAll) =>
                    filterSatisfyAllChange(additionalFilter.name, satisfyAll)
                "
                :optionsFilter="filterOptionsOverride[additionalFilter.name]"
                :returnTypeAsObject="true"
                :bulkOperation="true">
              </component>
              <div
              class="d-inline-block"
              v-if="filterLoading === additionalFilter.name">
                {{ uiText["filter_loading"] }}
                <i class="fa fa-spinner fa-pulse" aria-hidden="true"></i>
              </div>
            </div>
          </b-dropdown>
        </span>

        <button
          @click="showAllFilters = !showAllFilters"
          class="btn btn-link text-info">
          <span v-if="showAllFilters">Fewer filters</span>
          <span v-else>More filters</span>
        </button>
      </div>
    </div>
    <negotiator-selection v-model="showCart" />
  </div>
</template>

<script>
import CollectionSelectAll from './buttons/CollectionSelectAll.vue'
import { mapGetters, mapMutations, mapState, mapActions } from 'vuex'

/** Components used for filters */
import SearchFilter from './filters/SearchFilter.vue'
import CheckboxFilter from './filters/CheckboxFilter.vue'
import MultiFilter from './filters/MultiFilter.vue'
import NegotiatorSelection from './popovers/NegotiatorSelection.vue'
/** */

export default {
  components: {
    CollectionSelectAll,
    SearchFilter,
    CheckboxFilter,
    MultiFilter,
    NegotiatorSelection
  },
  computed: {
    ...mapGetters([
      'loading',
      'foundCollectionIds',
      'activeFilters',
      'activeSatisfyAll',
      'selectedCollections',
      'uiText'
    ]),
    ...mapState([
      'menuHeight',
      'applicationContext',
      'filterFacets',
      'filterMenuInitiallyFolded',
      'filterLoading',
      'filterOptionsOverride',
      'lastUpdatedFilter'
    ]),
    showSettings () {
      return this.applicationContext.roles
        ? this.applicationContext.roles.includes('ROLE_SU')
        : false
    },
    facetsToRender () {
      return this.filterFacets
        .filter(filter => !filter.builtIn)
        .filter(filter => filter.showFacet)
    },
    moreFacets () {
      return this.filterFacets.filter(
        filter => !filter.showFacet && !filter.builtIn
      )
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
      showAllFilters: false,
      showCart: false
    }
  },
  methods: {
    ...mapMutations([
      'UpdateFilterSelection',
      'ClearActiveFilters',
      'UpdateFilterSatisfyAll'
    ]),
    ...mapActions([
      'getReducedFilterOptions',
      'setFilterActivation'
    ]),
    filterChange (name, value) {
      this.UpdateFilterSelection({ name, value })
    },
    filterSatisfyAllChange (name, value) {
      this.UpdateFilterSatisfyAll({ name, value })
    },
    filterVariant (filterName) {
      const facetColor = 'secondary'
      const prefix = this.filterSelectionCount(filterName) > 0 ? '' : 'outline-'
      return `${prefix}${facetColor}`
    },
    filterSelectionCount (filterName) {
      const filtersActive = this.activeFilters[filterName]
      if (!filtersActive) {
        return 0
      } else {
        return filtersActive.length
      }
    },
    calculateOptions (filter) {
      /**
       * Each time a filter is expanded (shown=True) this function is triggered
       * GetUpdateFilter checks how many search results each of the filter options will generate
       */
      if (filter.adaptive) {
        this.setFilterActivation({ filterName: filter.name, activation: true })
        this.getReducedFilterOptions({ filterName: filter.name, activeFilters: this.activeFilters })
      } else {
        return 0
      }
    },
    setInactive (filter) {
      if (filter.adaptive) {
        this.setFilterActivation({ filterName: filter.name, activation: false })
      } else {
        return 0
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
  width: 44%;
}
</style>

<style>
/* Theme override */
.dropdown-toggle {
  padding-right: 1.5rem;
}

.filter-dropdown .dropdown-toggle::after {
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
