<template>
  <ul class="list-inline" v-if="Object.keys(activeFilters).length > 0">
    <template v-for="(values, filter) in activeFilters">
      <li class="list-inline-item" v-for="value in values" v-bind:key="value.id">
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary"
          @click="removeFilter(filter, value.id)"
          aria-label="Remove filter"
        >
          {{ value.label }}
          <i class="fa fa-times" aria-hidden="true"></i>
        </button>
      </li>
    </template>
    <li class="list-inline-item">
      <button
        type="button"
        class="btn btn-sm btn-outline-danger reset-all-filters-btn"
        @click="resetAllFilters"
      >Reset all filters</button>
    </li>
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
import { UPDATE_FILTER, RESET_FILTERS, SET_SEARCH } from '../../store/mutations'
import utils from '../../utils'
import { mapGetters } from 'vuex'

export default {
  name: 'active-filter-list',
  methods: {
    removeFilter (filterType, selectedFilterId) {
      const filters = utils.removeFilterFromFilterArrayById(
        this.activeFilters[filterType],
        selectedFilterId
      )
      this.$store.commit(UPDATE_FILTER, { name: filterType, filters: filters })
      const value = filters.length === 0 ? undefined : filters.join(',')
      this.$router.push({
        query: { ...this.$store.state.route.query, [filterType]: value }
      })
    },
    resetAllFilters () {
      this.$store.commit(RESET_FILTERS)
      this.$store.commit(SET_SEARCH, '')
      this.$router.push({ query: {} })
    }
  },
  computed: {
    ...mapGetters({ activeFilters: 'getActiveFilters' })
  }
}
</script>
