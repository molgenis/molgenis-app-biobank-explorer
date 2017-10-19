<template>
  <div class="biobank-cards-container">
    <div v-if="!loading">
      <biobank-card
        v-for="(biobank, id) in biobanks"
        :key="biobank.id"
        :biobank="biobank">
      </biobank-card>
    </div>

    <div v-else>
      <h4>Loading Biobanks... <i class="fa fa-spinner fa-pulse"></i></h4>
    </div>
  </div>
</template>

<style>
  .biobank-cards-container {
    width: 100%;
    height: 80vh;
    overflow: auto;
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
