<template>
  <div id="filter-container">
    <country-filters></country-filters>
    <material-filters></material-filters>
    <standards-filters></standards-filters>
    <diagnosis-available-filters></diagnosis-available-filters>
  </div>
</template>

<style>
  .filter-card {
    margin-bottom: 1rem;
  }

  .filter-header {
    background-color: #e4e4e4;
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
