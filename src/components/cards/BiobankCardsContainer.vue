<template>
  <div class="biobank-cards-container">
    <div v-if="!loading && biobanks.length > 0">
      <biobank-card
        v-for="(biobank, id) in biobanks"
        :key="biobank.id"
        :biobank="biobank">
      </biobank-card>
    </div>

    <div v-else-if="!loading && biobanks.length === 0" class="status-text">
      <h4>No biobanks were found</h4>
    </div>

    <div v-else class="status-text">
      <h4>Loading Biobanks... <i class="fa fa-spinner fa-pulse"></i></h4>
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
  import { mapState } from 'vuex'

  export default {
    name: 'biobank-cards-container',
    computed: {
      ...mapState(['loading', 'biobanks'])
    },
    components: {
      BiobankCard
    }
  }
</script>
