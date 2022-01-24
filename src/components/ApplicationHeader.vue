<template>
  <!-- using container for bootstrap's max-width -->
  <div class="container p-3 header-bar card">
    <filter-bar />
    <div aria-label="action-bar" class="py-4">
      <div class="container-fluid px-0">
        <div class="row">
          <div class="col">
            <collection-select-all
              v-if="!loading && foundCollectionIds.length"
              bookmark/>
          </div>
          <div class="col">
            <search-filter />
          </div>
          <div class="col">
            <pagination />
          </div>
        </div>
      </div>
    </div>
    <result-header v-if="!loading" />
  </div>
</template>

<script>
import SearchFilter from './filters/SearchFilter.vue'
import CollectionSelectAll from './buttons/CollectionSelectAll.vue'
import Pagination from './buttons/Pagination.vue'
import { mapGetters } from 'vuex'
import ResultHeader from './ResultHeader.vue'
import FilterBar from './filters/FilterBar.vue'

export default {
  components: {
    SearchFilter,
    CollectionSelectAll,
    Pagination,
    ResultHeader,
    FilterBar
  },
  computed: {
    ...mapGetters(['loading', 'foundCollectionIds'])
  }
}
</script>

<style>
.header-bar {
  background-color: white;
}
</style>
