<template>
  <ul class="list-inline" v-if="Object.keys(activeFilters).length > 0">
    <template v-for="(values, filter) in activeFilters">
      <li class="list-inline-item active-filter" v-for="value in values" @click="removeFilter(filter, value.id)">
        <small>{{ value.label }}</b></small> <i title="remove this filter" class="fa fa-times remove-filter-btn"></i>
      </li>
    </template>
    <li class="list-inline-item"><button class="btn btn-sm btn-outline-danger reset-all-filters-btn" @click="resetAllFilters">Reset all filters</button></li>
  </ul>
</template>

<style>
  .active-filter {
    padding: 0.1em 0.3em 0.3em;
    border: solid 1px;
    margin-bottom: 0.2em;
  }

  .active-filter:hover {
    cursor: pointer;
    color: red;
  }

  .reset-all-filters-btn {
    cursor: pointer;
  }
</style>

<script>
  import { UPDATE_FILTER, RESET_FILTERS } from '../../store/mutations'
  import { mapGetters } from 'vuex'

  export default {
    name: 'active-filter-list',
    methods: {
      removeFilter (filterType, selectedFilterId) {
        const filters = this.activeFilters[filterType].filter(filter => filter.id !== selectedFilterId).map(filter => filter.id)
        this.$store.commit(UPDATE_FILTER, {name: filterType, filters: filters})
      },
      resetAllFilters () {
        this.$store.commit(RESET_FILTERS)
      }
    },
    computed: {
      ...mapGetters({activeFilters: 'getActiveFilters'})
    }
  }
</script>
