<template>
  <div class="biobank-cards-container">
    <div v-if="!loading && biobanks.length > 0">
      <b-pagination v-if="biobanks.length > pageSize" size="md" align="center"
                    :total-rows="biobanks.length" v-model="currentPage" :per-page="pageSize"></b-pagination>
      <biobank-card
        v-for="biobank in biobanks.slice(pageSize * (currentPage-1), pageSize * currentPage)"
        :key="biobank.id"
        :biobank="biobank"
        :initCollapsed="!isAnyFilterActive">
      </biobank-card>

      <b-pagination v-if="biobanks.length > pageSize" size="md" align="center"
                    :total-rows="biobanks.length" v-model="currentPage" :per-page="pageSize"></b-pagination>
    </div>

    <div v-else-if="!loading && biobanks.length === 0" class="status-text">
      <h4>No biobanks were found</h4>
    </div>

    <div v-else class="status-text">
      <h4>Loading Biobanks... <em class="fa fa-spinner fa-pulse"></em></h4>
    </div>
  </div>
</template>

<style>
  .status-text {
    text-align: center;
    justify-content: center;
    padding: 1rem;
  }

  .biobank-cards-container {
    width: 100%;
  }
</style>

<script>
  import BiobankCard from './BiobankCard'
  import { mapGetters } from 'vuex'

  export default {
    name: 'biobank-cards-container',
    data () {
      return {
        currentPage: 1,
        pageSize: 10
      }
    },
    computed: {
      ...mapGetters(['biobanks', 'loading', 'getActiveFilters']),
      isAnyFilterActive () {
        return Object.keys(this.getActiveFilters).length > 0
      }
    },
    components: {
      BiobankCard
    },
    watch: {
      biobanks () {
        this.currentPage = 1
      }
    }
  }
</script>
