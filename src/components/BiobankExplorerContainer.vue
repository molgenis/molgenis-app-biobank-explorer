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
  import { mapGetters } from 'vuex'

  import { MAP_QUERY_TO_STATE, GET_BIOBANK_IDENTIFIERS } from '../store/actions'

  export default {
    name: 'biobank-explorer-container',
    components: {
      BiobankCardsContainer,
      FilterContainer,
      ResultHeader
    },
    computed: {
      ...mapGetters(['rsql'])
    },
    watch: {
      rsql () {
        this.$store.dispatch(GET_BIOBANK_IDENTIFIERS)
      }
    },
    mounted () {
      /* On page load, maps URL query parameters to the state */
      this.$store.dispatch(MAP_QUERY_TO_STATE)
    }
  }
</script>
