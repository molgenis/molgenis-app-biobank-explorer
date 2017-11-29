<template>
  <div id="filter-container">
    <diagnosis-available-filters></diagnosis-available-filters>
    <material-filters></material-filters>
    <country-filters></country-filters>
    <standards-filters></standards-filters>
  </div>
</template>

<style>
  .filter-card {
    margin-bottom: 1rem;
  }

  .filter-header {
    /* Same color as BiobankCard */
    background-color: #f5f5f5;
  }

  .filter-header:hover {
    cursor: pointer;
  }
</style>


<script>
  import CountryFilters from './CountryFilters.vue'
  import MaterialFilters from './MaterialFilters.vue'
  import StandardsFilters from './StandardsFilters.vue'
  import DiagnosisAvailableFilters from './DiagnosisAvailableFilters.vue'

  export default {
    name: 'filter-container',
    components: {
      CountryFilters,
      MaterialFilters,
      StandardsFilters,
      DiagnosisAvailableFilters
    }
  }
</script>
