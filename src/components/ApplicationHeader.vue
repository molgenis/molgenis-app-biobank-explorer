<template>
  <!-- using container for bootstrap's max-width -->
  <div class="position-fixed container px-3 pb-3 header-bar card">
    <filter-bar />
    <div aria-label="action-bar" class="py-4">
      <div class="container-fluid">
        <div class="row">
          <div class="col">
            <collection-select-all
              v-if="!loading && foundCollectionIds.length"
              class="col"
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
import CollectionSelectAll from '@/components/buttons/CollectionSelectAll.vue'
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
  top: 0;
  padding-top: 80px; /* Molgenis header is 80px, and so content scrolled is not seen */
  background-color: white;
  z-index: 100;
}
</style>
