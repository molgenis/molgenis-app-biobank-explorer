<template>
  <div id="filters">
    <country-filters></country-filters>

    <hr>

    <material-filters></material-filters>

    <hr>

    <standards-filters></standards-filters>

    <hr>

    <diagnosis-available-filters></diagnosis-available-filters>
  </div>
</template>

<style>
  .filter-header {
    background-color: #dedede;
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
