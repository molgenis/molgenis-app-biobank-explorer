<template>
  <ul class="list-inline" v-if="Object.keys(activeFilters).length > 0">
    <template v-for="(values, filter) in activeFilters">
      <li class="list-inline-item mb-2" v-for="value in values" v-bind:key="value.id">
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary"
          @click="removeFilter(filter, value.id)"
          aria-label="Remove filter"
        >
          {{ value.label || value.name }}
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
import utils from '../../utils'
import { mapGetters } from 'vuex'

export default {
  name: 'active-filter-list',
  methods: {
    removeFilter (filterName, selectedFilterId) {
      const filters = utils.removeFilterFromFilterArrayById(
        this.activeFilters[filterName],
        selectedFilterId
      )
      this.$store.commit('UpdateFilter', { name: filterName, filters: filters })
      const value = filters.length === 0 ? undefined : filters.join(',')
      this.$router.push({
        query: { ...this.$store.state.route.query, [filterName]: value }
      })
    },
    resetAllFilters () {
      this.$store.commit('ResetFilters')
      this.$store.commit('SetSearch', '')
      this.$router.push({ query: {} })
    }
  },
  computed: {
    ...mapGetters({ activeFilters: 'getActiveFilters' })
  }
}
</script>
