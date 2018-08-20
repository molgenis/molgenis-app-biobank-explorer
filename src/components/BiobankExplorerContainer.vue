<template>
  <div class="row biobank-explorer-container">
    <div class="col-md-3">
      <filter-container></filter-container>
    </div>

    <div class="col-md-9">
      <div class="row">
        <div class="col-md-12">
          <result-header></result-header>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12">
          <biobank-cards-container></biobank-cards-container>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .biobank-explorer-container {
    padding-top: 1rem;
  }
</style>

<script>
  import BiobankCardsContainer from './cards/BiobankCardsContainer'
  import FilterContainer from './filters/FilterContainer'
  import ResultHeader from './ResultHeader'

  import { MAP_QUERY_TO_STATE, GET_BIOBANK_IDENTIFIERS } from '../store/actions'

  export default {
    name: 'biobank-explorer-container',
    components: {
      BiobankCardsContainer,
      FilterContainer,
      ResultHeader
    },
    computed: {
      /* A computed 'compound' object for watching all filters */
      // TODO: Use an action to retrieve the collections when the filters are changed
      filters () {
        return {
          search: this.$store.state.search,
          country: this.$store.state.country.filters,
          materials: this.$store.state.materials.filters,
          standards: this.$store.state.standards.filters,
          diagnosis_available: this.$store.state.diagnosis_available.filters,
          type: this.$store.state.type.filters,
          dataType: this.$store.state.dataType.filters
        }
      }
    },
    watch: {
      filters () {
        this.$store.dispatch(GET_BIOBANK_IDENTIFIERS)
      }
    },
    mounted () {
      /* On page load, maps URL query parameters to the state */
      this.$store.dispatch(MAP_QUERY_TO_STATE)
    }
  }
</script>
